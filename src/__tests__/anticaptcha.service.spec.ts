import { AntiCaptcha } from 'anticaptcha'; // Removed AntiCaptchaError, ErrorCodes, TaskTypes
import {
  CaptchaServiceError,
  InsufficientBalanceError,
  InvalidApiKeyError,
  IpBlockedError,
} from '../errors/api.error.js';
import { AntiCaptchaService } from '../services/anticaptcha.service.js';

// Mock implementations for the instance methods that will be used by AntiCaptchaService
const mockGetBalance = jest.fn();
const mockCreateTask = jest.fn();
const mockGetTaskResult = jest.fn();

// Mock the external 'anticaptcha' library
jest.mock('anticaptcha', () => {
  const originalModule = jest.requireActual('anticaptcha'); // This will have AntiCaptchaError, ErrorCodes, TaskTypes
  return {
    ...originalModule,
    AntiCaptcha: jest.fn().mockImplementation(() => ({
      // Mock constructor for AntiCaptcha
      getBalance: mockGetBalance,
      createTask: mockCreateTask,
      getTaskResult: mockGetTaskResult,
    })),
  };
});

// AntiCaptcha is now the mock constructor. Cast to jest.Mock for simplicity in usage.
const MockAntiCaptcha = AntiCaptcha as jest.Mock;

describe('AntiCaptchaService', () => {
  let service: AntiCaptchaService;
  const apiKey = 'test-api-key';

  beforeEach(() => {
    // Clear all mock calls and reset mock implementations before each test
    MockAntiCaptcha.mockClear();
    mockGetBalance.mockClear().mockReset();
    mockCreateTask.mockClear().mockReset();
    mockGetTaskResult.mockClear().mockReset();

    service = new AntiCaptchaService(apiKey);
  });

  describe('constructor', () => {
    it('should create an instance of AntiCaptcha with the provided apiKey', () => {
      expect(MockAntiCaptcha).toHaveBeenCalledTimes(1);
      expect(MockAntiCaptcha).toHaveBeenCalledWith(apiKey);
    });
  });

  describe('getBalance', () => {
    it('should return the balance on success', async () => {
      const mockBalanceValue = 123.45;
      mockGetBalance.mockResolvedValue(mockBalanceValue);

      const balance = await service.getBalance();
      expect(balance).toBe(mockBalanceValue);
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });

    it('should throw IpBlockedError when IP is blocked', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_IP_BLOCKED,
        'IP blocked',
      );
      mockGetBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(IpBlockedError);
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });

    it('should throw InvalidApiKeyError when API key is invalid', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_KEY_DOES_NOT_EXIST,
        'Key does not exist',
      );
      mockGetBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(InvalidApiKeyError);
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });

    it('should throw InsufficientBalanceError when balance is zero', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_ZERO_BALANCE,
        'Zero balance',
      );
      mockGetBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(
        InsufficientBalanceError,
      );
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });

    it('should throw CaptchaServiceError for other AntiCaptcha API errors', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        'OTHER_ERROR',
        'Some other API error',
      );
      mockGetBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(CaptchaServiceError);
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });

    it('should throw generic Error for non-AntiCaptcha errors', async () => {
      const error = new Error('Some other error'); // Generic error
      mockGetBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(
        'An unexpected error occurred with AntiCaptcha while fetching balance.',
      );
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });
  });

  describe('solveImageCaptcha', () => {
    const base64string = 'base64imagestring';
    const mockTaskId = 123;
    const mockSolutionText = 'captcha solution';

    it('should return the solution text on success', async () => {
      mockCreateTask.mockResolvedValue(mockTaskId);
      mockGetTaskResult.mockResolvedValue({
        solution: { text: mockSolutionText },
      });

      const solution = await service.solveImageCaptcha(base64string);
      expect(solution).toBe(mockSolutionText);
      expect(mockCreateTask).toHaveBeenCalledWith({
        type: jest.requireActual('anticaptcha').TaskTypes.IMAGE_TO_TEXT, // Using actual TaskTypes
        body: base64string,
      });
      expect(mockGetTaskResult).toHaveBeenCalledWith(mockTaskId);
    });

    it('should throw IpBlockedError when IP is blocked during createTask', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_IP_BLOCKED,
        'IP blocked',
      );
      mockCreateTask.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        IpBlockedError,
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw IpBlockedError when IP is blocked during getTaskResult', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_IP_BLOCKED,
        'IP blocked',
      );
      mockCreateTask.mockResolvedValue(mockTaskId);
      mockGetTaskResult.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        IpBlockedError,
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).toHaveBeenCalledTimes(1);
    });

    it('should throw InvalidApiKeyError when API key is invalid during createTask', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_KEY_DOES_NOT_EXIST,
        'Key does not exist',
      );
      mockCreateTask.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        InvalidApiKeyError,
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw InsufficientBalanceError when balance is zero during createTask', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_ZERO_BALANCE,
        'Zero balance',
      );
      mockCreateTask.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        InsufficientBalanceError,
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw CaptchaServiceError for other AntiCaptcha API errors during createTask', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        'OTHER_ERROR',
        'Some other API error',
      );
      mockCreateTask.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        CaptchaServiceError,
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw generic Error for non-AntiCaptcha errors during createTask', async () => {
      const error = new Error('Some other error');
      mockCreateTask.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        'An unexpected error occurred with AntiCaptcha while solving image captcha.',
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw generic Error for non-AntiCaptcha errors during getTaskResult', async () => {
      const error = new Error('Some other error');
      mockCreateTask.mockResolvedValue(mockTaskId);
      mockGetTaskResult.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        'An unexpected error occurred with AntiCaptcha while solving image captcha.',
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).toHaveBeenCalledTimes(1);
    });
  });

  describe('solveRecaptchaV2', () => {
    const websiteURL = 'https://example.com';
    const websiteKey = 'test-site-key';
    const mockTaskId = 456;
    const mockRecaptchaToken = 'recaptcha-response-token';

    it('should return the reCAPTCHA token on success', async () => {
      mockCreateTask.mockResolvedValue(mockTaskId);
      mockGetTaskResult.mockResolvedValue({
        solution: { gRecaptchaResponse: mockRecaptchaToken },
      });

      const token = await service.solveRecaptchaV2(websiteURL, websiteKey);
      expect(token).toBe(mockRecaptchaToken);
      expect(mockCreateTask).toHaveBeenCalledWith({
        type: jest.requireActual('anticaptcha').TaskTypes.RECAPTCHAV2_PROXYLESS,
        websiteURL,
        websiteKey,
      });
      expect(mockGetTaskResult).toHaveBeenCalledWith(mockTaskId);
    });

    it('should throw IpBlockedError when IP is blocked during createTask', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_IP_BLOCKED,
        'IP blocked',
      );
      mockCreateTask.mockRejectedValue(error);

      await expect(
        service.solveRecaptchaV2(websiteURL, websiteKey),
      ).rejects.toThrow(IpBlockedError);
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw InvalidApiKeyError when API key is invalid during createTask', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_KEY_DOES_NOT_EXIST,
        'Key does not exist',
      );
      mockCreateTask.mockRejectedValue(error);

      await expect(
        service.solveRecaptchaV2(websiteURL, websiteKey),
      ).rejects.toThrow(InvalidApiKeyError);
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw InsufficientBalanceError when balance is zero during createTask', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_ZERO_BALANCE,
        'Zero balance',
      );
      mockCreateTask.mockRejectedValue(error);

      await expect(
        service.solveRecaptchaV2(websiteURL, websiteKey),
      ).rejects.toThrow(InsufficientBalanceError);
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw CaptchaServiceError for other AntiCaptcha API errors during createTask', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        'OTHER_ERROR',
        'Some other API error',
      );
      mockCreateTask.mockRejectedValue(error);

      await expect(
        service.solveRecaptchaV2(websiteURL, websiteKey),
      ).rejects.toThrow(CaptchaServiceError);
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw generic Error for non-AntiCaptcha errors during createTask', async () => {
      const error = new Error('Some other error');
      mockCreateTask.mockRejectedValue(error);

      await expect(
        service.solveRecaptchaV2(websiteURL, websiteKey),
      ).rejects.toThrow(
        'An unexpected error occurred with AntiCaptcha while solving reCAPTCHA v2.',
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });
  });
});
