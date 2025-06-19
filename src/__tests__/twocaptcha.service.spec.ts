import { Solver } from '2captcha'; // APIError will be accessed via jest.requireActual
import { CaptchaServiceError, InvalidApiKeyError } from '../errors/index.js';
import { TwoCaptchaService } from '../services/twocaptcha.service.js';

// Mock implementations for the instance methods that will be used by TwoCaptchaService
const mockTwoCaptchaBalance = jest.fn();
const mockImageCaptcha = jest.fn();
const mockRecaptcha = jest.fn();
const mockHcaptcha = jest.fn();

// Mock the external '2captcha' library
jest.mock('2captcha', () => {
  const originalModule = jest.requireActual('2captcha');
  return {
    ...originalModule, // Preserve other exports like APIError
    Solver: jest.fn().mockImplementation(() => ({
      // Mock constructor
      balance: mockTwoCaptchaBalance,
      imageCaptcha: mockImageCaptcha,
      recaptcha: mockRecaptcha,
      hcaptcha: mockHcaptcha,
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
    mockRecaptcha.mockClear().mockReset();
    mockHcaptcha.mockClear().mockReset();
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

    it('should throw InvalidApiKeyError for wrong API key', async () => {
      const errorMessage = 'ERROR_WRONG_USER_KEY';
      const error = createActualApiError(errorMessage);
      if (!error.cause) error.cause = errorMessage;

      mockTwoCaptchaBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(InvalidApiKeyError);
      expect(mockTwoCaptchaBalance).toHaveBeenCalledTimes(1);
    });

    it('should throw CaptchaServiceError for other API errors', async () => {
      const errorMessage = 'Insufficient funds';
      const error = createActualApiError(errorMessage);
      if (!error.cause) error.cause = errorMessage;

      mockTwoCaptchaBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(CaptchaServiceError);
      expect(mockTwoCaptchaBalance).toHaveBeenCalledTimes(1);
    });

    it('should throw generic Error for other non-API errors', async () => {
      const error = new Error('Some other error');
      mockTwoCaptchaBalance.mockRejectedValue(error);

      await expect(service.getBalance()).rejects.toThrow(
        'An unexpected error occurred with 2Captcha while fetching balance.',
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

    it('should throw CaptchaServiceError for APIError', async () => {
      const errorMessage = 'CAPTCHA_UNSOLVABLE';
      const error = createActualApiError(errorMessage);
      if (!error.cause) error.cause = errorMessage;

      mockImageCaptcha.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        CaptchaServiceError,
      );
      expect(mockImageCaptcha).toHaveBeenCalledWith(base64string);
    });

    it('should throw generic Error for other non-API errors', async () => {
      const error = new Error('Some other error');
      mockImageCaptcha.mockRejectedValue(error);

      await expect(service.solveImageCaptcha(base64string)).rejects.toThrow(
        'An unexpected error occurred with 2Captcha while solving image captcha.',
      );
      expect(mockImageCaptcha).toHaveBeenCalledWith(base64string);
    });
  });

  describe('solveRecaptchaV2', () => {
    const websiteURL = 'https://example.com';
    const websiteKey = 'test-site-key';
    const mockRecaptchaToken = 'recaptcha-response-token';

    it('should return the reCAPTCHA token on success', async () => {
      mockRecaptcha.mockResolvedValue({ data: mockRecaptchaToken });

      const token = await service.solveRecaptchaV2(websiteURL, websiteKey);
      expect(token).toBe(mockRecaptchaToken);
      expect(mockRecaptcha).toHaveBeenCalledWith(websiteKey, websiteURL, {});
    });

    it('should throw CaptchaServiceError for APIError', async () => {
      const errorMessage = 'RECAPTCHA_INVALID_SITEKEY';
      const error = createActualApiError(errorMessage);
      if (!error.cause) error.cause = errorMessage;

      mockRecaptcha.mockRejectedValue(error);

      await expect(
        service.solveRecaptchaV2(websiteURL, websiteKey),
      ).rejects.toThrow(CaptchaServiceError);
      expect(mockRecaptcha).toHaveBeenCalledWith(websiteKey, websiteURL, {});
    });

    it('should throw generic Error for other non-API errors', async () => {
      const error = new Error('Some other error');
      mockRecaptcha.mockRejectedValue(error);

      await expect(
        service.solveRecaptchaV2(websiteURL, websiteKey),
      ).rejects.toThrow(
        'An unexpected error occurred with 2Captcha while solving reCAPTCHA v2.',
      );
      expect(mockRecaptcha).toHaveBeenCalledWith(websiteKey, websiteURL, {});
    });
  });

  describe('solveHCaptcha', () => {
    const websiteURL = 'https://accounts.hcaptcha.com/demo';
    const websiteKey = '4c672d35-0701-42b2-88c3-78380b0db560';
    const mockHCaptchaToken = 'hcaptcha-response-token';

    it('should return the hCaptcha token on success', async () => {
      mockHcaptcha.mockResolvedValue({ data: mockHCaptchaToken });

      const token = await service.solveHCaptcha(websiteURL, websiteKey);
      expect(token).toBe(mockHCaptchaToken);
      expect(mockHcaptcha).toHaveBeenCalledWith(websiteKey, websiteURL, {});
    });

    it('should throw CaptchaServiceError for APIError', async () => {
      const errorMessage = 'HCAPTCHA_INVALID_SITEKEY';
      const error = createActualApiError(errorMessage);
      if (!error.cause) error.cause = errorMessage;

      mockHcaptcha.mockRejectedValue(error);

      await expect(
        service.solveHCaptcha(websiteURL, websiteKey),
      ).rejects.toThrow(CaptchaServiceError);
      expect(mockHcaptcha).toHaveBeenCalledWith(websiteKey, websiteURL, {});
    });

    it('should throw generic Error for other non-API errors', async () => {
      const error = new Error('Some other error');
      mockHcaptcha.mockRejectedValue(error);

      await expect(
        service.solveHCaptcha(websiteURL, websiteKey),
      ).rejects.toThrow(
        'An unexpected error occurred with 2Captcha while solving hCaptcha.',
      );
      expect(mockHcaptcha).toHaveBeenCalledWith(websiteKey, websiteURL, {});
    });
  });

  describe('solveRecaptchaV3', () => {
    const websiteURL = 'https://www.google.com/recaptcha/api2/demo';
    const websiteKey = '6Le-wvkSAAAAAPBMRTvw0Q4Muexq1bi0DJwx_mJ-';
    const minScore = 0.3;
    const pageAction = 'verify';
    const mockRecaptchaV3Token = 'recaptcha-v3-response-token';

    it('should return the reCAPTCHA v3 token on success', async () => {
      mockRecaptcha.mockResolvedValue({ data: mockRecaptchaV3Token });

      const token = await service.solveRecaptchaV3(
        websiteURL,
        websiteKey,
        minScore,
        pageAction,
      );
      expect(token).toBe(mockRecaptchaV3Token);
      expect(mockRecaptcha).toHaveBeenCalledWith(websiteKey, websiteURL, {
        version: 'v3',
        min_score: minScore,
        action: pageAction,
      });
    });

    it('should throw CaptchaServiceError for APIError', async () => {
      const errorMessage = 'RECAPTCHA_INVALID_SITEKEY';
      const error = createActualApiError(errorMessage);
      if (!error.cause) error.cause = errorMessage;

      mockRecaptcha.mockRejectedValue(error);

      await expect(
        service.solveRecaptchaV3(websiteURL, websiteKey, minScore, pageAction),
      ).rejects.toThrow(CaptchaServiceError);
      expect(mockRecaptcha).toHaveBeenCalledWith(websiteKey, websiteURL, {
        version: 'v3',
        min_score: minScore,
        action: pageAction,
      });
    });

    it('should throw generic Error for other non-API errors', async () => {
      const error = new Error('Some other error');
      mockRecaptcha.mockRejectedValue(error);

      await expect(
        service.solveRecaptchaV3(websiteURL, websiteKey, minScore, pageAction),
      ).rejects.toThrow(
        'An unexpected error occurred with 2Captcha while solving reCAPTCHA v3.',
      );
      expect(mockRecaptcha).toHaveBeenCalledWith(websiteKey, websiteURL, {
        version: 'v3',
        min_score: minScore,
        action: pageAction,
      });
    });
  });

  describe('proxy support', () => {
    const proxyOptions = {
      type: 'http' as const,
      uri: '127.0.0.1:8080',
      username: 'proxyuser',
      password: 'proxypass',
    };

    it('should pass proxy options to solveRecaptchaV2', async () => {
      mockRecaptcha.mockResolvedValue({ data: 'token-with-proxy' });

      const result = await service.solveRecaptchaV2(
        'https://example.com',
        'test-key',
        proxyOptions,
      );

      expect(result).toBe('token-with-proxy');
      expect(mockRecaptcha).toHaveBeenCalledWith(
        'test-key',
        'https://example.com',
        {
          proxy: 'proxyuser:proxypass@127.0.0.1:8080',
          proxytype: 'HTTP',
        },
      );
    });

    it('should pass proxy options to solveHCaptcha', async () => {
      mockHcaptcha.mockResolvedValue({ data: 'hcaptcha-token-with-proxy' });

      const result = await service.solveHCaptcha(
        'https://accounts.hcaptcha.com/demo',
        'test-key',
        proxyOptions,
      );

      expect(result).toBe('hcaptcha-token-with-proxy');
      expect(mockHcaptcha).toHaveBeenCalledWith(
        'test-key',
        'https://accounts.hcaptcha.com/demo',
        {
          proxy: 'proxyuser:proxypass@127.0.0.1:8080',
          proxytype: 'HTTP',
        },
      );
    });

    it('should pass proxy options to solveRecaptchaV3', async () => {
      mockRecaptcha.mockResolvedValue({
        data: 'recaptcha-v3-token-with-proxy',
      });

      const result = await service.solveRecaptchaV3(
        'https://www.google.com/recaptcha/api2/demo',
        'test-key',
        0.5,
        'login',
        proxyOptions,
      );

      expect(result).toBe('recaptcha-v3-token-with-proxy');
      expect(mockRecaptcha).toHaveBeenCalledWith(
        'test-key',
        'https://www.google.com/recaptcha/api2/demo',
        {
          version: 'v3',
          min_score: 0.5,
          action: 'login',
          proxy: 'proxyuser:proxypass@127.0.0.1:8080',
          proxytype: 'HTTP',
        },
      );
    });
  });
});
