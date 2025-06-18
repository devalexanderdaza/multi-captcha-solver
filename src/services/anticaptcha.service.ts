/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import {
  AntiCaptcha,
  AntiCaptchaError,
  ErrorCodes,
  IImageToTextTask,
  IImageToTextTaskResult,
  TaskTypes,
} from 'anticaptcha';

import {
  CaptchaServiceError,
  InsufficientBalanceError,
  InvalidApiKeyError,
  IpBlockedError,
} from '../errors/api.error.js';
import { IMultiCaptchaSolver } from '../mcs.interface.js';

/**
 * @class AntiCaptchaService
 * @classdesc Service for solving captchas using the AntiCaptcha service.
 * Implements the IMultiCaptchaSolver interface.
 * @memberof AntiCaptchaService
 */
export class AntiCaptchaService implements IMultiCaptchaSolver {
  // Captcha solver definition
  private client: AntiCaptcha;

  /**
   * Creates an instance of AntiCaptchaService.
   * @constructor
   * @param {string} apiKey - The API key for the AntiCaptcha service.
   */
  constructor(apiKey: string) {
    this.client = new AntiCaptcha(apiKey);
  }

  /**
   * Retrieves the current balance from the AntiCaptcha account.
   *
   * @returns {Promise<number>} A promise that resolves with the account balance.
   * @throws {Error} Throws an error if the IP is blocked or if there's another issue fetching the balance.
   */
  async getBalance(): Promise<number> {
    try {
      const balance = await this.client.getBalance();
      return balance;
    } catch (error) {
      if (error instanceof AntiCaptchaError) {
        switch (error.code) {
          case ErrorCodes.ERROR_IP_BLOCKED:
            throw new IpBlockedError(
              'AntiCaptcha',
              'Your IP address is blocked.',
            );
          case ErrorCodes.ERROR_KEY_DOES_NOT_EXIST:
            throw new InvalidApiKeyError(
              'AntiCaptcha',
              'The API key provided is invalid.',
            );
          case ErrorCodes.ERROR_ZERO_BALANCE:
            throw new InsufficientBalanceError(
              'AntiCaptcha',
              'Insufficient balance in your account.',
            );
          default:
            throw new CaptchaServiceError(
              'AntiCaptcha',
              `API Error: ${error.message}`,
            );
        }
      } else {
        throw new Error(
          'An unexpected error occurred with AntiCaptcha while fetching balance.',
        );
      }
    }
  }

  /**
   * Solves an image captcha using the AntiCaptcha service.
   *
   * @param {string} base64string - A base64 encoded string of the captcha image to be solved.
   * @returns {Promise<string>} A promise that resolves with the text solution of the captcha.
   * @throws {Error} Throws an error if the IP is blocked or if there's another issue solving the captcha.
   */
  async solveImageCaptcha(base64string: string): Promise<string> {
    try {
      // Creating nocaptcha proxyless task
      const taskId = await this.client.createTask<IImageToTextTask>({
        type: TaskTypes.IMAGE_TO_TEXT,
        body: base64string,
      });

      // Waiting for resolution and do something
      const response =
        await this.client.getTaskResult<IImageToTextTaskResult>(taskId);

      return response.solution.text;
    } catch (error) {
      if (error instanceof AntiCaptchaError) {
        switch (error.code) {
          case ErrorCodes.ERROR_IP_BLOCKED:
            throw new IpBlockedError(
              'AntiCaptcha',
              'Your IP address is blocked.',
            );
          case ErrorCodes.ERROR_KEY_DOES_NOT_EXIST:
            throw new InvalidApiKeyError(
              'AntiCaptcha',
              'The API key provided is invalid.',
            );
          case ErrorCodes.ERROR_ZERO_BALANCE:
            throw new InsufficientBalanceError(
              'AntiCaptcha',
              'Insufficient balance in your account.',
            );
          default:
            throw new CaptchaServiceError(
              'AntiCaptcha',
              `Failed to solve captcha: ${error.message}`,
            );
        }
      } else {
        throw new Error(
          'An unexpected error occurred with AntiCaptcha while solving image captcha.',
        );
      }
    }
  }
}
