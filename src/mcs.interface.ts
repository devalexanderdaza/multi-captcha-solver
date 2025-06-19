/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { ECaptchaSolverService } from './mcs.enum.js';
import { ProxyOptions } from './types/proxy.types.js';

/**
 * Defines the contract for a captcha solving service.
 * Any service intending to solve captchas must implement this interface.
 *
 * @interface IMultiCaptchaSolver
 */
export interface IMultiCaptchaSolver {
  /**
   * Retrieves the current account balance from the captcha solving service.
   *
   * @returns A promise that resolves with the account balance in USD
   */
  getBalance(): Promise<number>;

  /**
   * Submits an image captcha to the service and returns the solution.
   *
   * @param base64string - A base64 encoded string representing the captcha image
   * @returns A promise that resolves with the text solution of the captcha
   */
  solveImageCaptcha(base64string: string): Promise<string>;

  /**
   * Solves a reCAPTCHA v2 challenge.
   *
   * @param websiteURL - The URL of the website where the reCAPTCHA is located
   * @param websiteKey - The site key of the reCAPTCHA
   * @param proxy - Optional proxy configuration for solving the captcha
   * @returns A promise that resolves with the reCAPTCHA token
   */
  solveRecaptchaV2(
    websiteURL: string,
    websiteKey: string,
    proxy?: ProxyOptions,
  ): Promise<string>;

  /**
   * Solves an hCaptcha challenge.
   *
   * @param websiteURL - The URL of the website where the hCaptcha is located
   * @param websiteKey - The site key of the hCaptcha
   * @param proxy - Optional proxy configuration for solving the captcha
   * @returns A promise that resolves with the hCaptcha token
   */
  solveHCaptcha(
    websiteURL: string,
    websiteKey: string,
    proxy?: ProxyOptions,
  ): Promise<string>;

  /**
   * Solves a reCAPTCHA v3 challenge.
   *
   * @param websiteURL - The URL of the website where the reCAPTCHA is located
   * @param websiteKey - The site key of the reCAPTCHA
   * @param minScore - The minimum score required (0.1 to 0.9)
   * @param pageAction - The action name for this request
   * @param proxy - Optional proxy configuration for solving the captcha
   * @returns A promise that resolves with the reCAPTCHA token
   */
  solveRecaptchaV3(
    websiteURL: string,
    websiteKey: string,
    minScore: number,
    pageAction: string,
    proxy?: ProxyOptions,
  ): Promise<string>;
}

/**
 * Configuration options for initializing a MultiCaptchaSolver instance.
 *
 * @interface IMultiCaptchaSolverOptions
 * @example
 * ```typescript
 * const options: IMultiCaptchaSolverOptions = {
 *   apiKey: 'YOUR_API_KEY',
 *   captchaService: ECaptchaSolverService.TwoCaptcha,
 *   retries: 3
 * };
 * ```
 */
export interface IMultiCaptchaSolverOptions {
  /**
   * The API key for the selected captcha solving service.
   * Get this from your service provider's dashboard.
   */
  apiKey: string;

  /**
   * The specific captcha solving service to be used.
   * Choose from available providers like TwoCaptcha or AntiCaptcha.
   */
  captchaService: ECaptchaSolverService;

  /**
   * Number of retries for failed captcha solving attempts.
   * Uses exponential backoff between retries.
   *
   * @default 3
   */
  retries?: number;
}
