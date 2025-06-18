/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { ECaptchaSolverService } from "./mcs.enum.js";
import { IMultiCaptchaSolver, IMultiCaptchaSolverOptions } from "./mcs.interface.js";

import { AntiCaptchaService } from "./services/anticaptcha.service.js";
import { TwoCaptchaService } from "./services/twocaptcha.service.js";

const solverServiceMap: { [key in ECaptchaSolverService]?: new (apiKey: string) => IMultiCaptchaSolver } = {
  [ECaptchaSolverService.AntiCaptcha]: AntiCaptchaService,
  [ECaptchaSolverService.TwoCaptcha]: TwoCaptchaService,
};

export class MultiCaptchaSolver {
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

    const SolverService = solverServiceMap[options.captchaService];

    if (SolverService) {
      this.captchaSolver = new SolverService(options.apiKey);
    } else {
      throw new Error("Invalid or unsupported captcha service.");
    }
  }

  /**
   * Get the balance of the captcha service.
   *
   * @returns {Promise<number>} - The balance of the captcha service.
   */
  public async getBalance(): Promise<number> {
    return this.captchaSolver.getBalance();
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
