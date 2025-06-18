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
  }

  /**
   * Retrieves the current balance from the selected captcha solving service.
   *
   * @returns {Promise<number>} A promise that resolves with the current balance.
   */
  public async getBalance(): Promise<number> {
    return this.captchaSolver.getBalance();
  }

  /**
   * Solves an image captcha.
   *
   * @param {string} base64string - A base64 encoded string of the captcha image to be solved.
   * @returns {Promise<string>} A promise that resolves with the captcha solution text.
   */
  public async solveImageCaptcha(base64string: string): Promise<string> {
    return this.captchaSolver.solveImageCaptcha(base64string);
  }
}
