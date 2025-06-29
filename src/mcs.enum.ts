/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

/**
 * Specifies the available captcha solver services that can be used.
 * Each service requires its own API key and has different pricing models.
 *
 * @enum ECaptchaSolverService
 * @example
 * ```typescript
 * const solver = new MultiCaptchaSolver({
 *   apiKey: 'YOUR_API_KEY',
 *   captchaService: ECaptchaSolverService.TwoCaptcha
 * });
 * ```
 */
export enum ECaptchaSolverService {
  /**
   * 2Captcha service - Popular and reliable captcha solving service.
   * @see https://2captcha.com
   */
  TwoCaptcha = '2captcha',

  /**
   * Anti-Captcha service - Fast and accurate captcha solving service.
   * @see https://anti-captcha.com
   */
  AntiCaptcha = 'anticaptcha',

  /**
   * CapMonster service - Advanced captcha solving service with high success rate.
   * @see https://capmonster.cloud
   */
  CapMonster = 'capmonster',

  // TODO - Implement the following captcha solver services
  // DeathByCaptcha = "deathbycaptcha",
  // ImageTyperz = "imagetyperz",
  // RuCaptcha = "rucaptcha",
  // CaptchasIO = "captchasio",
}
