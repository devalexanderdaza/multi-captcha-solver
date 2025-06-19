/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { APIError, Solver } from '2captcha';
import { CaptchaServiceError, InvalidApiKeyError } from '../main.js';
import { IMultiCaptchaSolver } from '../mcs.interface.js';

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

  async solveRecaptchaV2(
    websiteURL: string,
    websiteKey: string,
  ): Promise<string> {
    try {
      const result = await this.client.recaptcha(websiteKey, websiteURL);
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
}
