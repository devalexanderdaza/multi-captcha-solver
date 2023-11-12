import { ECaptchaSolverService } from "./mcs.enum.js";

/**
 * Interface for a multi captcha solver.
 * @interface IMultiCaptchaSolver
 * @export IMultiCaptchaSolver
 */
export interface IMultiCaptchaSolver {
  /**
   * Get the balance of the captcha solver account.
   *
   * @returns {Promise<number>} - The balance of the captcha solver account.
   */
  getBalance(): Promise<number>;

  /**
   * Solve a captcha.
   *
   * @param {string} base64string - A base64 encoded string of the captcha image.
   * @returns {Promise<string>} - The captcha solution.
   */
  solveImageCaptcha(base64string: string): Promise<string>;
}

/**
 * Interface for the options of a multi captcha solver.
 * @interface IMultiCaptchaSolverOptions
 * @export IMultiCaptchaSolverOptions
 */
export interface IMultiCaptchaSolverOptions {
  // Captcha solver API key
  apiKey: string;

  // Captcha solver service
  captchaService: ECaptchaSolverService;
}
