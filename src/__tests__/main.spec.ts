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

  describe('solveRecaptchaV2', () => {
    const websiteURL = 'https://example.com';
    const websiteKey = 'test-site-key';

    it('should call solveRecaptchaV2 on the instantiated AntiCaptchaService', async () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.AntiCaptcha,
      };
      const mockSolveRecaptchaV2 = jest
        .fn()
        .mockResolvedValue('recaptcha-token-anti');
      MockAntiCaptchaService.prototype.solveRecaptchaV2 = mockSolveRecaptchaV2;

      const solver = new MultiCaptchaSolver(options);
      await solver.solveRecaptchaV2(websiteURL, websiteKey);

      expect(mockSolveRecaptchaV2).toHaveBeenCalledTimes(1);
      expect(mockSolveRecaptchaV2).toHaveBeenCalledWith(websiteURL, websiteKey);
    });

    it('should call solveRecaptchaV2 on the instantiated TwoCaptchaService', async () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.TwoCaptcha,
      };
      const mockSolveRecaptchaV2 = jest
        .fn()
        .mockResolvedValue('recaptcha-token-two');
      MockTwoCaptchaService.prototype.solveRecaptchaV2 = mockSolveRecaptchaV2;

      const solver = new MultiCaptchaSolver(options);
      await solver.solveRecaptchaV2(websiteURL, websiteKey);

      expect(mockSolveRecaptchaV2).toHaveBeenCalledTimes(1);
      expect(mockSolveRecaptchaV2).toHaveBeenCalledWith(websiteURL, websiteKey);
    });
  });

  describe('solveHCaptcha', () => {
    const websiteURL = 'https://accounts.hcaptcha.com/demo';
    const websiteKey = '4c672d35-0701-42b2-88c3-78380b0db560';

    it('should call solveHCaptcha on the instantiated AntiCaptchaService', async () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.AntiCaptcha,
      };
      const mockSolveHCaptcha = jest
        .fn()
        .mockResolvedValue('hcaptcha-token-anti');
      MockAntiCaptchaService.prototype.solveHCaptcha = mockSolveHCaptcha;

      const solver = new MultiCaptchaSolver(options);
      const result = await solver.solveHCaptcha(websiteURL, websiteKey);

      expect(result).toBe('hcaptcha-token-anti');
      expect(mockSolveHCaptcha).toHaveBeenCalledTimes(1);
      expect(mockSolveHCaptcha).toHaveBeenCalledWith(websiteURL, websiteKey);
    });

    it('should call solveHCaptcha on the instantiated TwoCaptchaService', async () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.TwoCaptcha,
      };
      const mockSolveHCaptcha = jest
        .fn()
        .mockResolvedValue('hcaptcha-token-two');
      MockTwoCaptchaService.prototype.solveHCaptcha = mockSolveHCaptcha;

      const solver = new MultiCaptchaSolver(options);
      const result = await solver.solveHCaptcha(websiteURL, websiteKey);

      expect(result).toBe('hcaptcha-token-two');
      expect(mockSolveHCaptcha).toHaveBeenCalledTimes(1);
      expect(mockSolveHCaptcha).toHaveBeenCalledWith(websiteURL, websiteKey);
    });
  });

  describe('solveRecaptchaV3', () => {
    const websiteURL = 'https://www.google.com/recaptcha/api2/demo';
    const websiteKey = '6Le-wvkSAAAAAPBMRTvw0Q4Muexq1bi0DJwx_mJ-';
    const minScore = 0.3;
    const pageAction = 'verify';

    it('should call solveRecaptchaV3 on the instantiated AntiCaptchaService', async () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.AntiCaptcha,
      };
      const mockSolveRecaptchaV3 = jest
        .fn()
        .mockResolvedValue('recaptcha-v3-token-anti');
      MockAntiCaptchaService.prototype.solveRecaptchaV3 = mockSolveRecaptchaV3;

      const solver = new MultiCaptchaSolver(options);
      const result = await solver.solveRecaptchaV3(
        websiteURL,
        websiteKey,
        minScore,
        pageAction,
      );

      expect(result).toBe('recaptcha-v3-token-anti');
      expect(mockSolveRecaptchaV3).toHaveBeenCalledTimes(1);
      expect(mockSolveRecaptchaV3).toHaveBeenCalledWith(
        websiteURL,
        websiteKey,
        minScore,
        pageAction,
      );
    });

    it('should call solveRecaptchaV3 on the instantiated TwoCaptchaService', async () => {
      const options: IMultiCaptchaSolverOptions = {
        apiKey,
        captchaService: ECaptchaSolverService.TwoCaptcha,
      };
      const mockSolveRecaptchaV3 = jest
        .fn()
        .mockResolvedValue('recaptcha-v3-token-two');
      MockTwoCaptchaService.prototype.solveRecaptchaV3 = mockSolveRecaptchaV3;

      const solver = new MultiCaptchaSolver(options);
      const result = await solver.solveRecaptchaV3(
        websiteURL,
        websiteKey,
        minScore,
        pageAction,
      );

      expect(result).toBe('recaptcha-v3-token-two');
      expect(mockSolveRecaptchaV3).toHaveBeenCalledTimes(1);
      expect(mockSolveRecaptchaV3).toHaveBeenCalledWith(
        websiteURL,
        websiteKey,
        minScore,
        pageAction,
      );
    });
  });
});
