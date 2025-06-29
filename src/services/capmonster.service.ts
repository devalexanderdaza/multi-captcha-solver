import {
  CapMonsterCloudClientFactory,
  ClientOptions,
  HCaptchaRequest,
  ImageToTextRequest,
  RecaptchaV2Request,
  RecaptchaV3ProxylessRequest,
} from '@zennolab_com/capmonstercloud-client';
import { IMultiCaptchaSolver } from '../mcs.interface.js';
import { ProxyOptions } from '../types/proxy.types.js';

/**
 * CapMonster Cloud service implementation for solving various types of captchas
 * Wrapper around the official @zennolab_com/capmonstercloud-client library
 */
export class CapMonsterService implements IMultiCaptchaSolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any;

  /**
   * Initialize CapMonster Cloud service
   * @param apiKey - Your CapMonster Cloud API key
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('CapMonster Cloud API key is required');
    }

    const clientOptions = new ClientOptions({ clientKey: apiKey });
    this.client = CapMonsterCloudClientFactory.Create(clientOptions);
  }

  /**
   * Get account balance from CapMonster Cloud
   * @returns Promise with balance in USD
   */
  async getBalance(): Promise<number> {
    try {
      const balance = await this.client.getBalance();
      return parseFloat(balance.toString());
    } catch (error) {
      throw new Error(
        `CapMonster getBalance error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  /**
   * Solve image captcha using CapMonster Cloud
   * @param base64string - Base64 encoded image
   * @returns Promise with solved captcha text
   */
  async solveImageCaptcha(base64string: string): Promise<string> {
    try {
      const request = new ImageToTextRequest({
        body: base64string,
      });

      const result = await this.client.Solve(request);
      return result.solution.text;
    } catch (error) {
      throw new Error(
        `CapMonster solveImageCaptcha error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  /**
   * Solve ReCaptcha V2 using CapMonster Cloud
   * @param websiteURL - Website URL where captcha is located
   * @param websiteKey - ReCaptcha site key
   * @param proxy - Optional proxy configuration
   * @returns Promise with ReCaptcha token
   */
  async solveRecaptchaV2(
    websiteURL: string,
    websiteKey: string,
    proxy?: ProxyOptions,
  ): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestOptions: any = {
        websiteURL,
        websiteKey,
      };

      if (proxy) {
        const [host, port] = proxy.uri.split(':');
        requestOptions.proxy = {
          proxyType: proxy.type,
          proxyAddress: host,
          proxyPort: parseInt(port),
          proxyLogin: proxy.username,
          proxyPassword: proxy.password,
        };
      }

      const request = new RecaptchaV2Request(requestOptions);
      const result = await this.client.Solve(request);
      return result.solution.gRecaptchaResponse;
    } catch (error) {
      throw new Error(
        `CapMonster solveRecaptchaV2 error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  /**
   * Solve hCaptcha using CapMonster Cloud
   * @param websiteURL - Website URL where captcha is located
   * @param websiteKey - hCaptcha site key
   * @param proxy - Optional proxy configuration
   * @returns Promise with hCaptcha token
   */
  async solveHCaptcha(
    websiteURL: string,
    websiteKey: string,
    proxy?: ProxyOptions,
  ): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestOptions: any = {
        websiteURL,
        websiteKey,
      };

      if (proxy) {
        const [host, port] = proxy.uri.split(':');
        requestOptions.proxy = {
          proxyType: proxy.type,
          proxyAddress: host,
          proxyPort: parseInt(port),
          proxyLogin: proxy.username,
          proxyPassword: proxy.password,
        };
      }

      const request = new HCaptchaRequest(requestOptions);
      const result = await this.client.Solve(request);
      return result.solution.gRecaptchaResponse;
    } catch (error) {
      throw new Error(
        `CapMonster solveHCaptcha error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  /**
   * Solve ReCaptcha V3 using CapMonster Cloud
   * @param websiteURL - Website URL where captcha is located
   * @param websiteKey - ReCaptcha site key
   * @param minScore - Minimum score required (0.1 to 0.9)
   * @param pageAction - Page action for this request
   * @param proxy - Optional proxy configuration (not used in V3 - proxyless)
   * @returns Promise with ReCaptcha V3 token
   */
  async solveRecaptchaV3(
    websiteURL: string,
    websiteKey: string,
    minScore: number,
    pageAction: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _proxy?: ProxyOptions,
  ): Promise<string> {
    try {
      const request = new RecaptchaV3ProxylessRequest({
        websiteURL,
        websiteKey,
        minScore,
        pageAction,
      });

      const result = await this.client.Solve(request);
      return result.solution.gRecaptchaResponse;
    } catch (error) {
      throw new Error(
        `CapMonster solveRecaptchaV3 error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
