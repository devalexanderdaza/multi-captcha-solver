/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { ECaptchaSolverService } from './mcs.enum.js';

/**
 * Defines the contract for a captcha solving service.
 * Any service intending to solve captchas must implement this interface.
 * @interface IMultiCaptchaSolver
 */
export interface IMultiCaptchaSolver {
  /**
   * Retrieves the current account balance from the captcha solving service.
   *
   * @returns {Promise<number>} A promise that resolves with the account balance.
   */
  getBalance(): Promise<number>;

  /**
   * Submits an image captcha to the service and returns the solution.
   *
   * @param {string} base64string - A base64 encoded string representing the captcha image.
   * @returns {Promise<string>} A promise that resolves with the text solution of the captcha.
   */
  solveImageCaptcha(base64string: string): Promise<string>;
}

/**
 * Defines the configuration options for initializing a multi captcha solver.
 * @interface IMultiCaptchaSolverOptions
 */
export interface IMultiCaptchaSolverOptions {
  /**
   * The API key for the selected captcha solving service.
   * @property {string} apiKey
   */
  apiKey: string;

  /**
   * The specific captcha solving service to be used.
   * @property {ECaptchaSolverService} captchaService
   */
  captchaService: ECaptchaSolverService;
}
