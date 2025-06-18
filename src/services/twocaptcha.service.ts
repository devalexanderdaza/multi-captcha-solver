/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { Solver, APIError } from '2captcha';

import { IMultiCaptchaSolver } from '../mcs.interface.js';

/**
 * @class TwoCaptchaService
 * @classdesc Service for solving captchas using the 2Captcha service.
 * Implements the IMultiCaptchaSolver interface.
 * @memberof TwoCaptchaService
 */
export class TwoCaptchaService implements IMultiCaptchaSolver {
  // Captcha solver definition
  private client: Solver;

  /**
   * Creates an instance of TwoCaptchaService.
   * @constructor
   * @param {string} apiKey - The API key for the 2Captcha service.
   */
  constructor(apiKey: string) {
    this.client = new Solver(apiKey);
  }

  /**
   * Retrieves the current balance from the 2Captcha account.
   *
   * @returns {Promise<number>} A promise that resolves with the account balance.
   * @throws {Error} Throws an error if there's an issue fetching the balance, including API errors.
   */
  async getBalance(): Promise<number> {
    try {
      return await this.client.balance();
    } catch (error) {
      if (error instanceof APIError) {
        throw new Error(`Error getting balance from 2Captcha. ${error.cause}`);
      } else {
        throw new Error(`Error getting balance from 2Captcha.`);
      }
    }
  }

  /**
   * Solves an image captcha using the 2Captcha service.
   *
   * @param {string} base64string - A base64 encoded string of the captcha image to be solved.
   * @returns {Promise<string>} A promise that resolves with the text solution of the captcha.
   * @throws {Error} Throws an error if there's an issue solving the captcha, including API errors.
   */
  async solveImageCaptcha(base64string: string): Promise<string> {
    try {
      const solvedCaptcha = await this.client.imageCaptcha(base64string);
      return solvedCaptcha.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw new Error(`Error solving captcha with 2Captcha. ${error.cause}`);
      } else {
        throw new Error(`Error solving captcha with 2Captcha.`);
      }
    }
  }
}
