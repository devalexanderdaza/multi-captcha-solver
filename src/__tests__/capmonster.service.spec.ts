/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { CapMonsterService } from '../services/capmonster.service.js';

// Mock the CapMonster Cloud client
jest.mock('@zennolab_com/capmonstercloud-client', () => ({
  CapMonsterCloudClientFactory: {
    Create: jest.fn().mockReturnValue({
      getBalance: jest.fn(),
      Solve: jest.fn(),
    }),
  },
  ClientOptions: jest.fn(),
  ImageToTextRequest: jest.fn(),
  RecaptchaV2Request: jest.fn(),
  RecaptchaV3ProxylessRequest: jest.fn(),
  HCaptchaRequest: jest.fn(),
}));

import {
  CapMonsterCloudClientFactory,
  ClientOptions,
  HCaptchaRequest,
  ImageToTextRequest,
  RecaptchaV2Request,
  RecaptchaV3ProxylessRequest,
} from '@zennolab_com/capmonstercloud-client';

describe('CapMonsterService', () => {
  let capMonsterService: CapMonsterService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockClient = {
      getBalance: jest.fn(),
      Solve: jest.fn(),
    };

    (CapMonsterCloudClientFactory.Create as jest.Mock).mockReturnValue(
      mockClient,
    );
    capMonsterService = new CapMonsterService('test-api-key');
  });

  describe('constructor', () => {
    it('should throw error if no API key is provided', () => {
      expect(() => new CapMonsterService('')).toThrow(
        'CapMonster Cloud API key is required',
      );
    });

    it('should create client with correct options', () => {
      new CapMonsterService('test-api-key');
      expect(ClientOptions).toHaveBeenCalledWith({ clientKey: 'test-api-key' });
      expect(CapMonsterCloudClientFactory.Create).toHaveBeenCalled();
    });
  });

  describe('getBalance', () => {
    it('should return account balance', async () => {
      const mockBalance = '15.50';
      mockClient.getBalance.mockResolvedValue(mockBalance);

      const balance = await capMonsterService.getBalance();

      expect(balance).toBe(15.5);
      expect(mockClient.getBalance).toHaveBeenCalled();
    });

    it('should handle errors and throw with descriptive message', async () => {
      const error = new Error('Network error');
      mockClient.getBalance.mockRejectedValue(error);

      await expect(capMonsterService.getBalance()).rejects.toThrow(
        'CapMonster getBalance error: Network error',
      );
    });

    it('should handle unknown errors', async () => {
      mockClient.getBalance.mockRejectedValue('Unknown error');

      await expect(capMonsterService.getBalance()).rejects.toThrow(
        'CapMonster getBalance error: Unknown error',
      );
    });
  });

  describe('solveImageCaptcha', () => {
    it('should solve image captcha successfully', async () => {
      const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
      const mockResponse = {
        solution: { text: 'captcha_solution' },
      };

      mockClient.Solve.mockResolvedValue(mockResponse);

      const result = await capMonsterService.solveImageCaptcha(base64Image);

      expect(result).toBe('captcha_solution');
      expect(ImageToTextRequest).toHaveBeenCalledWith({
        body: base64Image,
      });
      expect(mockClient.Solve).toHaveBeenCalled();
    });

    it('should handle errors during image captcha solving', async () => {
      const error = new Error('Captcha solving failed');
      mockClient.Solve.mockRejectedValue(error);

      await expect(
        capMonsterService.solveImageCaptcha('base64'),
      ).rejects.toThrow(
        'CapMonster solveImageCaptcha error: Captcha solving failed',
      );
    });
  });

  describe('solveRecaptchaV2', () => {
    it('should solve ReCaptcha V2 without proxy', async () => {
      const websiteURL = 'https://example.com';
      const websiteKey = 'test-site-key';
      const mockResponse = {
        solution: { gRecaptchaResponse: 'recaptcha_token' },
      };

      mockClient.Solve.mockResolvedValue(mockResponse);

      const result = await capMonsterService.solveRecaptchaV2(
        websiteURL,
        websiteKey,
      );

      expect(result).toBe('recaptcha_token');
      expect(RecaptchaV2Request).toHaveBeenCalledWith({
        websiteURL,
        websiteKey,
      });
    });

    it('should solve ReCaptcha V2 with proxy', async () => {
      const websiteURL = 'https://example.com';
      const websiteKey = 'test-site-key';
      const proxy = {
        type: 'http' as const,
        uri: '127.0.0.1:8080',
        username: 'user',
        password: 'pass',
      };
      const mockResponse = {
        solution: { gRecaptchaResponse: 'recaptcha_token' },
      };

      mockClient.Solve.mockResolvedValue(mockResponse);

      const result = await capMonsterService.solveRecaptchaV2(
        websiteURL,
        websiteKey,
        proxy,
      );

      expect(result).toBe('recaptcha_token');
      expect(RecaptchaV2Request).toHaveBeenCalledWith({
        websiteURL,
        websiteKey,
        proxy: {
          proxyType: 'http',
          proxyAddress: '127.0.0.1',
          proxyPort: 8080,
          proxyLogin: 'user',
          proxyPassword: 'pass',
        },
      });
    });

    it('should handle errors during ReCaptcha V2 solving', async () => {
      const error = new Error('ReCaptcha solving failed');
      mockClient.Solve.mockRejectedValue(error);

      await expect(
        capMonsterService.solveRecaptchaV2('https://example.com', 'site-key'),
      ).rejects.toThrow(
        'CapMonster solveRecaptchaV2 error: ReCaptcha solving failed',
      );
    });
  });

  describe('solveHCaptcha', () => {
    it('should solve hCaptcha without proxy', async () => {
      const websiteURL = 'https://example.com';
      const websiteKey = 'test-site-key';
      const mockResponse = {
        solution: { gRecaptchaResponse: 'hcaptcha_token' },
      };

      mockClient.Solve.mockResolvedValue(mockResponse);

      const result = await capMonsterService.solveHCaptcha(
        websiteURL,
        websiteKey,
      );

      expect(result).toBe('hcaptcha_token');
      expect(HCaptchaRequest).toHaveBeenCalledWith({
        websiteURL,
        websiteKey,
      });
    });

    it('should solve hCaptcha with proxy', async () => {
      const websiteURL = 'https://example.com';
      const websiteKey = 'test-site-key';
      const proxy = {
        type: 'socks5' as const,
        uri: '192.168.1.1:1080',
        username: 'proxyuser',
        password: 'proxypass',
      };
      const mockResponse = {
        solution: { gRecaptchaResponse: 'hcaptcha_token' },
      };

      mockClient.Solve.mockResolvedValue(mockResponse);

      const result = await capMonsterService.solveHCaptcha(
        websiteURL,
        websiteKey,
        proxy,
      );

      expect(result).toBe('hcaptcha_token');
      expect(HCaptchaRequest).toHaveBeenCalledWith({
        websiteURL,
        websiteKey,
        proxy: {
          proxyType: 'socks5',
          proxyAddress: '192.168.1.1',
          proxyPort: 1080,
          proxyLogin: 'proxyuser',
          proxyPassword: 'proxypass',
        },
      });
    });

    it('should handle errors during hCaptcha solving', async () => {
      const error = new Error('hCaptcha solving failed');
      mockClient.Solve.mockRejectedValue(error);

      await expect(
        capMonsterService.solveHCaptcha('https://example.com', 'site-key'),
      ).rejects.toThrow(
        'CapMonster solveHCaptcha error: hCaptcha solving failed',
      );
    });
  });

  describe('solveRecaptchaV3', () => {
    it('should solve ReCaptcha V3', async () => {
      const websiteURL = 'https://example.com';
      const websiteKey = 'test-site-key';
      const minScore = 0.7;
      const pageAction = 'submit';
      const mockResponse = {
        solution: { gRecaptchaResponse: 'recaptcha_v3_token' },
      };

      mockClient.Solve.mockResolvedValue(mockResponse);

      const result = await capMonsterService.solveRecaptchaV3(
        websiteURL,
        websiteKey,
        minScore,
        pageAction,
      );

      expect(result).toBe('recaptcha_v3_token');
      expect(RecaptchaV3ProxylessRequest).toHaveBeenCalledWith({
        websiteURL,
        websiteKey,
        minScore,
        pageAction,
      });
    });

    it('should solve ReCaptcha V3 ignoring proxy parameter', async () => {
      const websiteURL = 'https://example.com';
      const websiteKey = 'test-site-key';
      const minScore = 0.9;
      const pageAction = 'login';
      const proxy = {
        type: 'http' as const,
        uri: '127.0.0.1:8080',
      };
      const mockResponse = {
        solution: { gRecaptchaResponse: 'recaptcha_v3_token' },
      };

      mockClient.Solve.mockResolvedValue(mockResponse);

      const result = await capMonsterService.solveRecaptchaV3(
        websiteURL,
        websiteKey,
        minScore,
        pageAction,
        proxy,
      );

      expect(result).toBe('recaptcha_v3_token');
      expect(RecaptchaV3ProxylessRequest).toHaveBeenCalledWith({
        websiteURL,
        websiteKey,
        minScore,
        pageAction,
      });
    });

    it('should handle errors during ReCaptcha V3 solving', async () => {
      const error = new Error('ReCaptcha V3 solving failed');
      mockClient.Solve.mockRejectedValue(error);

      await expect(
        capMonsterService.solveRecaptchaV3(
          'https://example.com',
          'site-key',
          0.7,
          'submit',
        ),
      ).rejects.toThrow(
        'CapMonster solveRecaptchaV3 error: ReCaptcha V3 solving failed',
      );
    });
  });
});
