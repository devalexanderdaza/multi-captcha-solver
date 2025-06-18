import { TwoCaptchaService } from '../services/twocaptcha.service';
import { Solver } from '2captcha'; // APIError will be accessed via jest.requireActual

// Mock implementations for the instance methods that will be used by TwoCaptchaService
const mockTwoCaptchaBalance = jest.fn();
const mockImageCaptcha = jest.fn();

// Mock the external '2captcha' library
jest.mock('2captcha', () => {
  const originalModule = jest.requireActual('2captcha');
  return {
    ...originalModule, // Preserve other exports like APIError
    Solver: jest.fn().mockImplementation(() => ({
      // Mock constructor
      balance: mockTwoCaptchaBalance,
      imageCaptcha: mockImageCaptcha,
    })),
  };
});

// Keep a reference to the mocked constructor for asserting constructor calls
const MockSolver = Solver as jest.Mock; // MockSolver is used to mock the Solver constructor for testing purposes.

// Helper to create an APIError instance for testing
// We need to use the actual APIError for instanceof checks to work correctly.
const createActualApiError = (
  causeMessage: string,
): import('2captcha').APIError => {
  // Used import('2captcha').APIError
  const actualTwoCaptcha = jest.requireActual('2captcha');
  // The actual APIError constructor might take specific arguments.
  // We assume it takes a message. The service relies on `error.cause`.
  const error = new actualTwoCaptcha.APIError(causeMessage);
  // Ensure 'cause' is set if the service relies on it and the constructor doesn't set it.
  // This is important for `throw new Error(`... ${error.cause}`);` in the service.
  if (!error.cause) {
    error.cause = causeMessage;
  }
  return error;
};

// Removed the fallback try-catch as direct instantiation should be preferred.
// The 'as APIError' cast is no longer needed if ActualAPIError is correctly typed.

describe('TwoCaptchaService', () => {
  let service: TwoCaptchaService;
  const apiKey = 'test-api-key';

  beforeEach(() => {
    MockSolver.mockClear();
    mockTwoCaptchaBalance.mockClear().mockReset();
    mockImageCaptcha.mockClear().mockReset();
    service = new TwoCaptchaService(apiKey);
  });

  describe('constructor', () => {
    it('should create an instance of Solver with the provided apiKey', () => {
      expect(MockSolver).toHaveBeenCalledTimes(1);
      expect(MockSolver).toHaveBeenCalledWith(apiKey);
    });
  });

  describe('getBalance', () => {
    it('should return the balance on success', async () => {
      const mockBalanceValue = 123.45;
      mockTwoCaptchaBalance.mockResolvedValue(mockBalanceValue);

      const balance = await service.getBalance();
      expect(balance).toBe(mockBalanceValue);
      expect(mockTwoCaptchaBalance).toHaveBeenCalledTimes(1);
    });

    it('should throw "Error getting balance from 2Captcha. [error.cause]" for APIError', async () => {
      const errorMessage = 'Insufficient funds';
      const error = createActualApiError(errorMessage);
      // Ensure the error object actually has the 'cause' property as expected by the service
      if (!error.cause) error.cause = errorMessage;

      mockTwoCaptchaBalance.mockRejectedValue(error);

      // The service formats the error message, so we match that format
      await expect(service.getBalance()).rejects.toThrow(
        `Error getting balance from 2Captcha. ${errorMessage}`,
      );
      expect(mockTwoCaptchaBalance).toHaveBeenCalledTimes(1);
    });

    it('should throw "Error getting balance from 2Captcha." for other errors', async () => {
      const error = new Error('Some other error');
      mockTwoCaptchaBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(
        'Error getting balance from 2Captcha.',
      );
      expect(mockTwoCaptchaBalance).toHaveBeenCalledTimes(1);
    });
  });

  describe('solveImageCaptcha', () => {
    const base64string = 'base64imagestring';
    const mockSolutionText = 'captcha solution';

    it('should return the solution data on success', async () => {
      mockImageCaptcha.mockResolvedValue({ data: mockSolutionText });

      const solution = await service.solveImageCaptcha(base64string);
      expect(solution).toBe(mockSolutionText);
      expect(mockImageCaptcha).toHaveBeenCalledWith(base64string);
    });

    it('should throw "Error solving captcha with 2Captcha. [error.cause]" for APIError', async () => {
      const errorMessage = 'CAPTCHA_UNSOLVABLE';
      const error = createActualApiError(errorMessage);
      if (!error.cause) error.cause = errorMessage;

      mockImageCaptcha.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        `Error solving captcha with 2Captcha. ${errorMessage}`,
      );
      expect(mockImageCaptcha).toHaveBeenCalledWith(base64string);
    });

    it('should throw "Error solving captcha with 2Captcha." for other errors', async () => {
      const error = new Error('Some other error');
      mockImageCaptcha.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        'Error solving captcha with 2Captcha.',
      );
      expect(mockImageCaptcha).toHaveBeenCalledWith(base64string);
    });
  });
});
