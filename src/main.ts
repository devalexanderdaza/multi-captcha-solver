/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { ECaptchaSolverService } from './mcs.enum.js';
import {
  IMultiCaptchaSolver,
  IMultiCaptchaSolverOptions,
} from './mcs.interface.js';
import { AntiCaptchaService } from './services/anticaptcha.service.js';
import { TwoCaptchaService } from './services/twocaptcha.service.js';
import { ProxyOptions } from './types/proxy.types.js';
import { withRetries } from './utils/retry.helper.js';

const solverServiceMap: {
  [key in ECaptchaSolverService]?: new (apiKey: string) => IMultiCaptchaSolver;
} = {
  [ECaptchaSolverService.AntiCaptcha]: AntiCaptchaService,
  [ECaptchaSolverService.TwoCaptcha]: TwoCaptchaService,
};

/**
 * @class MultiCaptchaSolver
 * @classdesc A class for solving captchas using multiple captcha solving services.
 * @memberof MultiCaptchaSolver
 */
export class MultiCaptchaSolver {
  private captchaSolver: IMultiCaptchaSolver;
  private readonly retries: number;
  private readonly initialDelayMs: number = 500;

  /**
   * Creates an instance of MultiCaptchaSolver.
   * @constructor
   * @param {IMultiCaptchaSolverOptions} options - The options for configuring the captcha solver.
   * Requires apiKey and captchaService to be specified.
   */
  constructor(options: IMultiCaptchaSolverOptions) {
    if (!options || !options.apiKey || !options.captchaService) {
      throw new Error('No valid options provided.');
    }

    const SolverService = solverServiceMap[options.captchaService];

    if (SolverService) {
      this.captchaSolver = new SolverService(options.apiKey);
    } else {
      throw new Error('Invalid or unsupported captcha service.');
    }

    this.retries = options.retries ?? 3;
  }

  /**
   * Retrieves the current balance from the selected captcha solving service.
   *
   * @returns {Promise<number>} A promise that resolves with the current balance.
   */
  public async getBalance(): Promise<number> {
    return withRetries(
      () => this.captchaSolver.getBalance(),
      this.retries,
      this.initialDelayMs,
    );
  }

  /**
   * Solves an image captcha.
   *
   * @param {string} base64string - A base64 encoded string of the captcha image to be solved.
   * @returns {Promise<string>} A promise that resolves with the captcha solution text.
   */
  public async solveImageCaptcha(base64string: string): Promise<string> {
    return withRetries(
      () => this.captchaSolver.solveImageCaptcha(base64string),
      this.retries,
      this.initialDelayMs,
    );
  }

  /**
   * Solves a reCAPTCHA v2 challenge.
   *
   * @param {string} websiteURL - The URL of the website where the reCAPTCHA is located.
   * @param {string} websiteKey - The site key of the reCAPTCHA.
   * @param {ProxyOptions} proxy - Optional proxy configuration for solving the captcha.
   * @returns {Promise<string>} A promise that resolves with the reCAPTCHA token.
   */
  public async solveRecaptchaV2(
    websiteURL: string,
    websiteKey: string,
    proxy?: ProxyOptions,
  ): Promise<string> {
    return withRetries(
      () => this.captchaSolver.solveRecaptchaV2(websiteURL, websiteKey, proxy),
      this.retries,
      this.initialDelayMs,
    );
  }

  /**
   * Solves an hCaptcha challenge.
   *
   * @param {string} websiteURL - The URL of the website where the hCaptcha is located.
   * @param {string} websiteKey - The site key of the hCaptcha.
   * @param {ProxyOptions} proxy - Optional proxy configuration for solving the captcha.
   * @returns {Promise<string>} A promise that resolves with the hCaptcha token.
   */
  public async solveHCaptcha(
    websiteURL: string,
    websiteKey: string,
    proxy?: ProxyOptions,
  ): Promise<string> {
    return withRetries(
      () => this.captchaSolver.solveHCaptcha(websiteURL, websiteKey, proxy),
      this.retries,
      this.initialDelayMs,
    );
  }

  /**
   * Solves a reCAPTCHA v3 challenge.
   *
   * @param {string} websiteURL - The URL of the website where the reCAPTCHA is located.
   * @param {string} websiteKey - The site key of the reCAPTCHA.
   * @param {number} minScore - The minimum score required (0.1 to 0.9).
   * @param {string} pageAction - The action name for this request.
   * @param {ProxyOptions} proxy - Optional proxy configuration for solving the captcha.
   * @returns {Promise<string>} A promise that resolves with the reCAPTCHA token.
   */
  public async solveRecaptchaV3(
    websiteURL: string,
    websiteKey: string,
    minScore: number,
    pageAction: string,
    proxy?: ProxyOptions,
  ): Promise<string> {
    return withRetries(
      () =>
        this.captchaSolver.solveRecaptchaV3(
          websiteURL,
          websiteKey,
          minScore,
          pageAction,
          proxy,
        ),
      this.retries,
      this.initialDelayMs,
    );
  }
}

// Export custom errors for better error handling
export {
  CaptchaServiceError,
  InsufficientBalanceError,
  InvalidApiKeyError,
  IpBlockedError,
  MultiCaptchaError,
} from './errors/index.js';

// Export enums and interfaces for users
export { ECaptchaSolverService } from './mcs.enum.js';
export type {
  IMultiCaptchaSolver,
  IMultiCaptchaSolverOptions,
} from './mcs.interface.js';
export type { ProxyOptions } from './types/proxy.types.js';
