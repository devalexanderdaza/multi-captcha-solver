/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { ECaptchaSolverService } from "./mcs.enum.js";
import { IMultiCaptchaSolver, IMultiCaptchaSolverOptions } from "./mcs.interface.js";

import { AntiCaptchaService } from "./services/anticaptcha.service.js";
import { TwoCaptchaService } from "./services/twocaptcha.service.js";

export class MultiCaptchaSolver {
  // Captcha solver definition
  private captchaSolver: IMultiCaptchaSolver;

  /**
   * Creates an instance of MultiCaptchaSolver.
   * @param {IMultiCaptchaSolverOptions} options - The options for the captcha solver.
   * @memberof MultiCaptchaSolver
   */
  constructor(options: IMultiCaptchaSolverOptions) {
    if (!options || !options.apiKey || !options.captchaService) {
      throw new Error("No valid options provided.");
    }

    // Initialize the captcha solver based on the captcha service provided
    if (options.captchaService === ECaptchaSolverService.AntiCaptcha) {
      this.captchaSolver = new AntiCaptchaService(options.apiKey);
    } else if (options.captchaService === ECaptchaSolverService.TwoCaptcha) {
      this.captchaSolver = new TwoCaptchaService(options.apiKey);
    } else {
      throw new Error("Invalid captcha service.");
    }
  }

  /**
   * Get the balance of the captcha service.
   *
   * @returns {Promise<number>} - The balance of the captcha service.
   */
  public async getBalance(): Promise<number> {
    return await this.captchaSolver.getBalance();
  }

  /**
   * Solve a captcha.
   *
   * @param {string} base64string - A base64 encoded string of the captcha image.
   * @returns {Promise<string>} - The captcha solution.
   */
  public async solveImageCaptcha(base64string: string): Promise<string> {
    return this.captchaSolver.solveImageCaptcha(base64string);
  }
}
