import { MultiCaptchaSolver } from '../main.js';
import { ECaptchaSolverService } from '../mcs.enum.js';
import { IMultiCaptchaSolverOptions } from '../mcs.interface.js';
import { AntiCaptchaService } from '../services/anticaptcha.service.js';
import { TwoCaptchaService } from '../services/twocaptcha.service.js';

// Mock the services
jest.mock('../services/anticaptcha.service');
jest.mock('../services/twocaptcha.service');

const MockAntiCaptchaService = AntiCaptchaService as jest.MockedClass<
  typeof AntiCaptchaService
>;
const MockTwoCaptchaService = TwoCaptchaService as jest.MockedClass<
  typeof TwoCaptchaService
>;

describe('MultiCaptchaSolver', () => {
  const apiKey = 'test-api-key';

  beforeEach(() => {
    // Clear all mocks before each test
    MockAntiCaptchaService.mockClear();
    MockTwoCaptchaService.mockClear();
  });

  describe('constructor', () => {
    it('should throw an error if no options are provided', () => {
      expect(
        () =>
          new MultiCaptchaSolver(null as unknown as IMultiCaptchaSolverOptions),
      ).toThrow('No valid options provided.');
      expect(
        () =>
          new MultiCaptchaSolver(
            undefined as unknown as IMultiCaptchaSolverOptions,
          ),
      ).toThrow('No valid options provided.');
    });

    it('should throw an error if apiKey is missing', () => {
      const options: Partial<IMultiCaptchaSolverOptions> = {
        captchaService: ECaptchaSolverService.AntiCaptcha,
      };
      expect(
        () => new MultiCaptchaSolver(options as IMultiCaptchaSolverOptions),
      ).toThrow('No valid options provided.');
    });

    it('should throw an error if captchaService is missing', () => {
      const options: Partial<IMultiCaptchaSolverOptions> = { apiKey };
      expect(
        () => new MultiCaptchaSolver(options as IMultiCaptchaSolverOptions),
      ).toThrow('No valid options provided.');
    });

    it('should throw an error for an invalid or unsupported captchaService', () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: 'unsupportedService' as ECaptchaSolverService,
      };
      expect(() => new MultiCaptchaSolver(options)).toThrow(
        'Invalid or unsupported captcha service.',
      );
    });

    it('should correctly instantiate AntiCaptchaService', () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.AntiCaptcha,
      };
      new MultiCaptchaSolver(options);
      expect(MockAntiCaptchaService).toHaveBeenCalledTimes(1);
      expect(MockAntiCaptchaService).toHaveBeenCalledWith(apiKey);
      expect(MockTwoCaptchaService).not.toHaveBeenCalled();
    });

    it('should correctly instantiate TwoCaptchaService', () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.TwoCaptcha,
      };
      new MultiCaptchaSolver(options);
      expect(MockTwoCaptchaService).toHaveBeenCalledTimes(1);
      expect(MockTwoCaptchaService).toHaveBeenCalledWith(apiKey);
      expect(MockAntiCaptchaService).not.toHaveBeenCalled();
    });
  });

  describe('getBalance', () => {
    it('should call getBalance on the instantiated AntiCaptchaService', async () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.AntiCaptcha,
      };
      const mockGetBalance = jest.fn().mockResolvedValue(10);
      MockAntiCaptchaService.prototype.getBalance = mockGetBalance;

      const solver = new MultiCaptchaSolver(options);
      await solver.getBalance();

      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });

    it('should call getBalance on the instantiated TwoCaptchaService', async () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.TwoCaptcha,
      };
      const mockGetBalance = jest.fn().mockResolvedValue(20);
      MockTwoCaptchaService.prototype.getBalance = mockGetBalance;

      const solver = new MultiCaptchaSolver(options);
      await solver.getBalance();

      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });
  });

  describe('solveImageCaptcha', () => {
    const base64string = 'test-base64';

    it('should call solveImageCaptcha on the instantiated AntiCaptchaService', async () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.AntiCaptcha,
      };
      const mockSolveImageCaptcha = jest.fn().mockResolvedValue('solved-anti');
      MockAntiCaptchaService.prototype.solveImageCaptcha =
        mockSolveImageCaptcha;

      const solver = new MultiCaptchaSolver(options);
      await solver.solveImageCaptcha(base64string);

      expect(mockSolveImageCaptcha).toHaveBeenCalledTimes(1);
      expect(mockSolveImageCaptcha).toHaveBeenCalledWith(base64string);
    });

    it('should call solveImageCaptcha on the instantiated TwoCaptchaService', async () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.TwoCaptcha,
      };
      const mockSolveImageCaptcha = jest.fn().mockResolvedValue('solved-two');
      MockTwoCaptchaService.prototype.solveImageCaptcha = mockSolveImageCaptcha;

      const solver = new MultiCaptchaSolver(options);
      await solver.solveImageCaptcha(base64string);

      expect(mockSolveImageCaptcha).toHaveBeenCalledTimes(1);
      expect(mockSolveImageCaptcha).toHaveBeenCalledWith(base64string);
    });
  });
});
