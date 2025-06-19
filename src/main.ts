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
 * The main class for solving different types of captchas using multiple services.
 * It provides a unified interface to interact with various captcha providers.
 *
 * @example
 * ```typescript
 * const solver = new MultiCaptchaSolver({
 *   apiKey: 'YOUR_API_KEY',
 *   captchaService: ECaptchaSolverService.TwoCaptcha,
 *   retries: 3
 * });
 *
 * // Solve a reCAPTCHA v2
 * const token = await solver.solveRecaptchaV2(
 *   'https://example.com',
 *   'site-key'
 * );
 * ```
 */
export class MultiCaptchaSolver {
  private captchaSolver: IMultiCaptchaSolver;
  private readonly retries: number;
  private readonly initialDelayMs: number = 500;

  /**
   * Creates an instance of MultiCaptchaSolver.
   *
   * @param options - The configuration options for the captcha solver
   * @throws {Error} When invalid options are provided
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
   * @returns A promise that resolves with the current account balance in USD
   * @throws {CaptchaServiceError} When the API service returns an error
   * @throws {InvalidApiKeyError} When the API key is invalid
   * @throws {InsufficientBalanceError} When there's no balance in the account
   *
   * @example
   * ```typescript
   * const balance = await solver.getBalance();
   * console.log(`Current balance: $${balance}`);
   * ```
   */
  public async getBalance(): Promise<number> {
    return withRetries(
      () => this.captchaSolver.getBalance(),
      this.retries,
      this.initialDelayMs,
    );
  }

  /**
   * Solves an image-based captcha using optical character recognition.
   *
   * @param base64string - A base64 encoded string of the captcha image to be solved
   * @returns A promise that resolves with the captcha solution text
   * @throws {CaptchaServiceError} When the API service returns an error
   * @throws {InvalidApiKeyError} When the API key is invalid
   *
   * @example
   * ```typescript
   * const imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
   * const solution = await solver.solveImageCaptcha(imageBase64);
   * console.log(`Captcha solution: ${solution}`);
   * ```
   */
  public async solveImageCaptcha(base64string: string): Promise<string> {
    return withRetries(
      () => this.captchaSolver.solveImageCaptcha(base64string),
      this.retries,
      this.initialDelayMs,
    );
  }

  /**
   * Solves a reCAPTCHA v2 challenge on a given website.
   *
   * @param websiteURL - The full URL of the page where the reCAPTCHA is present
   * @param websiteKey - The reCAPTCHA site key from the page's HTML
   * @param proxy - Optional proxy configuration for solving the captcha
   * @returns A promise that resolves with the reCAPTCHA token
   * @throws {CaptchaServiceError} When the API service returns an error
   * @throws {InvalidApiKeyError} When the API key is invalid
   *
   * @example
   * ```typescript
   * const token = await solver.solveRecaptchaV2(
   *   'https://example.com/login',
   *   '6Le-wvkSAAAAAPBMRTvw0Q4Muexq1bi0DJwx_mJ-'
   * );
   * console.log(`reCAPTCHA token: ${token}`);
   * ```
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
   * Solves an hCaptcha challenge on a given website.
   *
   * @param websiteURL - The full URL of the page where the hCaptcha is present
   * @param websiteKey - The hCaptcha site key from the page's HTML
   * @param proxy - Optional proxy configuration for solving the captcha
   * @returns A promise that resolves with the hCaptcha solution token
   * @throws {CaptchaServiceError} When the API service returns an error
   * @throws {InvalidApiKeyError} When the API key is invalid
   *
   * @example
   * ```typescript
   * const token = await solver.solveHCaptcha(
   *   'https://accounts.hcaptcha.com/demo',
   *   '4c672d35-0701-42b2-88c3-78380b0db560'
   * );
   * console.log(`hCaptcha token: ${token}`);
   * ```
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
   * Solves a reCAPTCHA v3 challenge on a given website.
   *
   * @param websiteURL - The full URL of the page where the reCAPTCHA is present
   * @param websiteKey - The reCAPTCHA v3 site key from the page's HTML
   * @param minScore - The minimum score required (0.1 to 0.9, higher means more human-like)
   * @param pageAction - The action name for this request (e.g., 'login', 'submit', 'verify')
   * @param proxy - Optional proxy configuration for solving the captcha
   * @returns A promise that resolves with the reCAPTCHA v3 token
   * @throws {CaptchaServiceError} When the API service returns an error
   * @throws {InvalidApiKeyError} When the API key is invalid
   *
   * @example
   * ```typescript
   * const token = await solver.solveRecaptchaV3(
   *   'https://www.google.com/recaptcha/api2/demo',
   *   '6Le-wvkSAAAAAPBMRTvw0Q4Muexq1bi0DJwx_mJ-',
   *   0.7,
   *   'homepage'
   * );
   * console.log(`reCAPTCHA v3 token: ${token}`);
   * ```
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
