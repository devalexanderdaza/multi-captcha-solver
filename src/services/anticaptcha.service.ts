/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import {
  AntiCaptcha,
  AntiCaptchaError,
  ErrorCodes,
  IImageToTextTask,
  IImageToTextTaskResult,
  TaskTypes
} from "anticaptcha";

import { IMultiCaptchaSolver } from "../mcs.interface.js";

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
      if (
        error instanceof AntiCaptchaError &&
        error.code === ErrorCodes.ERROR_IP_BLOCKED
      ) {
        // Handle IP block
        throw new Error("IP blocked by AntiCaptcha.");
      }
      else {
        // Handle other errors
        throw new Error("Error getting balance from AntiCaptcha.");
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
      if (
        error instanceof AntiCaptchaError &&
        error.code === ErrorCodes.ERROR_IP_BLOCKED
      ) {
        // Handle IP block
        throw new Error("IP blocked by AntiCaptcha.");
      }
      else {
        // Handle other errors
        throw new Error("Error solving captcha by AntiCaptcha.");
      }
    }
  }
}
