/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { APIError, Solver } from '2captcha';
import { CaptchaServiceError, InvalidApiKeyError } from '../main.js';
import { IMultiCaptchaSolver } from '../mcs.interface.js';
import { ProxyOptions } from '../types/proxy.types.js';

export class TwoCaptchaService implements IMultiCaptchaSolver {
  private client: Solver;

  constructor(apiKey: string) {
    this.client = new Solver(apiKey);
  }

  async getBalance(): Promise<number> {
    try {
      return await this.client.balance();
    } catch (error) {
      if (
        error instanceof APIError &&
        typeof error.cause === 'string' &&
        error.cause.includes('ERROR_WRONG_USER_KEY')
      ) {
        throw new InvalidApiKeyError(
          '2Captcha',
          'The API key provided is invalid.',
        );
      } else if (error instanceof APIError) {
        throw new CaptchaServiceError('2Captcha', `API Error: ${error.cause}`);
      } else {
        throw new Error(
          'An unexpected error occurred with 2Captcha while fetching balance.',
        );
      }
    }
  }

  async solveImageCaptcha(base64string: string): Promise<string> {
    try {
      const solvedCaptcha = await this.client.imageCaptcha(base64string);
      return solvedCaptcha.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw new CaptchaServiceError(
          '2Captcha',
          `Failed to solve captcha: ${error.cause}`,
        );
      } else {
        throw new Error(
          'An unexpected error occurred with 2Captcha while solving image captcha.',
        );
      }
    }
  }

  /**
   * Converts ProxyOptions to 2Captcha proxy format
   * @private
   */
  private convertProxyOptions(proxy?: ProxyOptions): {
    proxy?: string;
    proxytype?: string;
  } {
    if (!proxy) return {};

    const [host, port] = proxy.uri.split(':');
    const proxyString =
      proxy.username && proxy.password
        ? `${proxy.username}:${proxy.password}@${host}:${port}`
        : `${host}:${port}`;

    return {
      proxy: proxyString,
      proxytype: proxy.type.toUpperCase(),
    };
  }

  async solveRecaptchaV2(
    websiteURL: string,
    websiteKey: string,
    proxy?: ProxyOptions,
  ): Promise<string> {
    try {
      const proxyConfig = this.convertProxyOptions(proxy);
      const result = await this.client.recaptcha(
        websiteKey,
        websiteURL,
        proxyConfig,
      );
      return result.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw new CaptchaServiceError(
          '2Captcha',
          `Failed to solve reCAPTCHA v2: ${error.cause}`,
        );
      }
      throw new Error(
        'An unexpected error occurred with 2Captcha while solving reCAPTCHA v2.',
      );
    }
  }

  /**
   * Solves an hCaptcha challenge using the 2Captcha service.
   *
   * @param {string} websiteURL - The URL of the website where the hCaptcha is located.
   * @param {string} websiteKey - The site key of the hCaptcha.
   * @param {ProxyOptions} proxy - Optional proxy configuration for solving the captcha.
   * @returns {Promise<string>} A promise that resolves with the hCaptcha token.
   * @throws {Error} Throws an error if there's an issue solving the hCaptcha.
   */
  async solveHCaptcha(
    websiteURL: string,
    websiteKey: string,
    proxy?: ProxyOptions,
  ): Promise<string> {
    try {
      const proxyConfig = this.convertProxyOptions(proxy);
      const result = await this.client.hcaptcha(
        websiteKey,
        websiteURL,
        proxyConfig,
      );
      return result.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw new CaptchaServiceError(
          '2Captcha',
          `Failed to solve hCaptcha: ${error.cause}`,
        );
      }
      throw new Error(
        'An unexpected error occurred with 2Captcha while solving hCaptcha.',
      );
    }
  }

  /**
   * Solves a reCAPTCHA v3 challenge using the 2Captcha service.
   *
   * @param {string} websiteURL - The URL of the website where the reCAPTCHA is located.
   * @param {string} websiteKey - The site key of the reCAPTCHA.
   * @param {number} minScore - The minimum score required (0.1 to 0.9).
   * @param {string} pageAction - The action name for this request.
   * @param {ProxyOptions} proxy - Optional proxy configuration for solving the captcha.
   * @returns {Promise<string>} A promise that resolves with the reCAPTCHA token.
   * @throws {Error} Throws an error if there's an issue solving the reCAPTCHA v3.
   */
  async solveRecaptchaV3(
    websiteURL: string,
    websiteKey: string,
    minScore: number,
    pageAction: string,
    proxy?: ProxyOptions,
  ): Promise<string> {
    try {
      const proxyConfig = this.convertProxyOptions(proxy);
      const result = await this.client.recaptcha(websiteKey, websiteURL, {
        version: 'v3',
        min_score: minScore,
        action: pageAction,
        ...proxyConfig,
      });
      return result.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw new CaptchaServiceError(
          '2Captcha',
          `Failed to solve reCAPTCHA v3: ${error.cause}`,
        );
      }
      throw new Error(
        'An unexpected error occurred with 2Captcha while solving reCAPTCHA v3.',
      );
    }
  }
}
