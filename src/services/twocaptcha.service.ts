import { Solver, APIError } from '2captcha';

import { IMultiCaptchaSolver } from "../mcs.interface.js";

export class TwoCaptchaService implements IMultiCaptchaSolver {

  // Captcha solver definition
  private client: Solver;

  /**
   * Creates an instance of TwoCaptchaService.
   * @param {string} apiKey - The API key for the 2Captcha service.
   * @memberof TwoCaptchaService
   */
  constructor(apiKey: string) {
    this.client = new Solver(apiKey);
  }

  /**
   * Get the balance of the 2Captcha account.
   *
   * @returns {Promise<number>} - The balance of the 2Captcha account.
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
   * Solve a captcha.
   *
   * @param {string} base64string - A base64 encoded string of the captcha image.
   * @returns {Promise<string>} - The captcha solution.
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
