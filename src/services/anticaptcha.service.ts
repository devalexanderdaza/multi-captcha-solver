/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import {
  AntiCaptcha,
  AntiCaptchaError,
  ErrorCodes,
  IHCaptchaTaskProxyless,
  IHCaptchaTaskProxylessResult,
  IImageToTextTask,
  IImageToTextTaskResult,
  IRecaptchaV2TaskProxyless,
  IRecaptchaV2TaskProxylessResult,
  IRecaptchaV3TaskProxyless,
  IRecaptchaV3TaskProxylessResult,
  RecaptchaWorkerScore,
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

  /**
   * Solves a reCAPTCHA v2 challenge using the AntiCaptcha service.
   *
   * @param {string} websiteURL - The URL of the website where the reCAPTCHA is located.
   * @param {string} websiteKey - The site key of the reCAPTCHA.
   * @returns {Promise<string>} A promise that resolves with the reCAPTCHA token.
   * @throws {Error} Throws an error if the IP is blocked or if there's another issue solving the reCAPTCHA v2.
   */
  async solveRecaptchaV2(
    websiteURL: string,
    websiteKey: string,
  ): Promise<string> {
    try {
      // Creating reCAPTCHA v2 proxyless task
      const taskId = await this.client.createTask<IRecaptchaV2TaskProxyless>({
        type: TaskTypes.RECAPTCHAV2_PROXYLESS,
        websiteURL,
        websiteKey,
      });

      // Waiting for resolution and do something
      const response =
        await this.client.getTaskResult<IRecaptchaV2TaskProxylessResult>(
          taskId,
        );

      return response.solution.gRecaptchaResponse;
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
              `Failed to solve reCAPTCHA v2: ${error.message}`,
            );
        }
      } else {
        throw new Error(
          'An unexpected error occurred with AntiCaptcha while solving reCAPTCHA v2.',
        );
      }
    }
  }

  /**
   * Solves an hCaptcha challenge using the AntiCaptcha service.
   *
   * @param {string} websiteURL - The URL of the website where the hCaptcha is located.
   * @param {string} websiteKey - The site key of the hCaptcha.
   * @returns {Promise<string>} A promise that resolves with the hCaptcha token.
   * @throws {Error} Throws an error if the IP is blocked or if there's another issue solving the hCaptcha.
   */
  async solveHCaptcha(websiteURL: string, websiteKey: string): Promise<string> {
    try {
      // Creating hCaptcha proxyless task
      const taskId = await this.client.createTask<IHCaptchaTaskProxyless>({
        type: TaskTypes.HCAPTCHA_PROXYLESS,
        websiteURL,
        websiteKey,
      });

      // Waiting for resolution and do something
      const response =
        await this.client.getTaskResult<IHCaptchaTaskProxylessResult>(taskId);

      return response.solution.gRecaptchaResponse;
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
              `Failed to solve hCaptcha: ${error.message}`,
            );
        }
      } else {
        throw new Error(
          'An unexpected error occurred with AntiCaptcha while solving hCaptcha.',
        );
      }
    }
  }

  /**
   * Solves a reCAPTCHA v3 challenge using the AntiCaptcha service.
   *
   * @param {string} websiteURL - The URL of the website where the reCAPTCHA is located.
   * @param {string} websiteKey - The site key of the reCAPTCHA.
   * @param {number} minScore - The minimum score required (0.1 to 0.9).
   * @param {string} pageAction - The action name for this request.
   * @returns {Promise<string>} A promise that resolves with the reCAPTCHA token.
   * @throws {Error} Throws an error if the IP is blocked or if there's another issue solving the reCAPTCHA v3.
   */
  async solveRecaptchaV3(
    websiteURL: string,
    websiteKey: string,
    minScore: number,
    pageAction: string,
  ): Promise<string> {
    try {
      // Validate minScore parameter and map to RecaptchaWorkerScore enum
      let workerScore: RecaptchaWorkerScore;
      if (minScore <= 0.4) {
        workerScore = RecaptchaWorkerScore.LOW;
      } else if (minScore <= 0.7) {
        workerScore = RecaptchaWorkerScore.MEDIUM;
      } else {
        workerScore = RecaptchaWorkerScore.HIGH;
      }

      // Creating reCAPTCHA v3 proxyless task
      const taskId = await this.client.createTask<IRecaptchaV3TaskProxyless>({
        type: TaskTypes.RECAPTCHA_PROXYLESS,
        websiteURL,
        websiteKey,
        minScore: workerScore,
        pageAction,
      });

      // Waiting for resolution and do something
      const response =
        await this.client.getTaskResult<IRecaptchaV3TaskProxylessResult>(
          taskId,
        );

      return response.solution.gRecaptchaResponse;
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
              `Failed to solve reCAPTCHA v3: ${error.message}`,
            );
        }
      } else {
        throw new Error(
          'An unexpected error occurred with AntiCaptcha while solving reCAPTCHA v3.',
        );
      }
    }
  }
}
