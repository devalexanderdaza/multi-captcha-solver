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

export class AntiCaptchaService implements IMultiCaptchaSolver {

  // Captcha solver definition
  private client: AntiCaptcha;

  /**
   * Creates an instance of AntiCaptchaService.
   * @param {string} apiKey - The API key for the AntiCaptcha service.
   * @memberof AntiCaptchaService
   */
  constructor(apiKey: string) {
    this.client = new AntiCaptcha(apiKey);
  }

  /**
   * Get the balance of the AntiCaptcha account.
   *
   * @returns {Promise<number>} - The balance of the AntiCaptcha account.
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
   * Solve a captcha.
   *
   * @param {string} base64string - A base64 encoded string of the captcha image.
   * @returns {Promise<string>} - The captcha solution.
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
