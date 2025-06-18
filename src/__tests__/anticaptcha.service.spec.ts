import { AntiCaptchaService } from '../services/anticaptcha.service';
import { AntiCaptcha } from 'anticaptcha'; // Removed AntiCaptchaError, ErrorCodes, TaskTypes

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

    it('should throw "IP blocked by AntiCaptcha." when IP is blocked', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_IP_BLOCKED,
        'IP blocked',
      );
      mockGetBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(
        'IP blocked by AntiCaptcha.',
      );
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });

    it('should throw "Error getting balance from AntiCaptcha." for other errors', async () => {
      const error = new Error('Some other error'); // Generic error
      mockGetBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(
        'Error getting balance from AntiCaptcha.',
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

    it('should throw "IP blocked by AntiCaptcha." when IP is blocked during createTask', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_IP_BLOCKED,
        'IP blocked',
      );
      mockCreateTask.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        'IP blocked by AntiCaptcha.',
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw "IP blocked by AntiCaptcha." when IP is blocked during getTaskResult', async () => {
      const actualAnticaptcha = jest.requireActual('anticaptcha');
      const error = new actualAnticaptcha.AntiCaptchaError(
        actualAnticaptcha.ErrorCodes.ERROR_IP_BLOCKED,
        'IP blocked',
      );
      mockCreateTask.mockResolvedValue(mockTaskId);
      mockGetTaskResult.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        'IP blocked by AntiCaptcha.',
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).toHaveBeenCalledTimes(1);
    });

    it('should throw "Error solving captcha by AntiCaptcha." for other errors during createTask', async () => {
      const error = new Error('Some other error');
      mockCreateTask.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        'Error solving captcha by AntiCaptcha.',
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).not.toHaveBeenCalled();
    });

    it('should throw "Error solving captcha by AntiCaptcha." for other errors during getTaskResult', async () => {
      const error = new Error('Some other error');
      mockCreateTask.mockResolvedValue(mockTaskId);
      mockGetTaskResult.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        'Error solving captcha by AntiCaptcha.',
      );
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockGetTaskResult).toHaveBeenCalledTimes(1);
    });
  });
});
