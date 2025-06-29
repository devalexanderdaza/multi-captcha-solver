/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { MultiCaptchaSolver } from '../src/main.js';
import { ECaptchaSolverService } from '../src/mcs.enum.js';
import { IMultiCaptchaSolverOptions } from '../src/mcs.interface.js';

// Base64 encoded string of a captcha image
const base64string: string =
  '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';

// MultiCaptchaSolver options
const options: IMultiCaptchaSolverOptions = {
  apiKey: 'YOUR_API_KEY', // Replace with your API key from the captcha service provider (e.g. 2Captcha, AntiCaptcha, CapMonster, etc.)
  captchaService: ECaptchaSolverService.AntiCaptcha, // Replace with the captcha service provider you want to use (e.g. 2Captcha, AntiCaptcha, CapMonster, etc.)
};

// Example with CapMonster Cloud
const capMonsterOptions: IMultiCaptchaSolverOptions = {
  apiKey: 'YOUR_CAPMONSTER_API_KEY',
  captchaService: ECaptchaSolverService.CapMonster,
};

/**
 * Test the MultiCaptchaSolver class.
 */
export const solveCaptchaExample = async (
  options: IMultiCaptchaSolverOptions,
): Promise<void> => {
  // Create a new instance of MultiCaptchaSolver
  const solver: MultiCaptchaSolver = new MultiCaptchaSolver(options);

  // Get the balance of the captcha service
  const balance: number = await solver.getBalance();
  console.info(`Balance on ${options.captchaService}: ${balance}`);

  // Solve the captcha
  const solution: string = await solver.solveImageCaptcha(base64string); // This expected result is '52848783'
  console.info(`Solution of captcha on ${options.captchaService}: ${solution}`);
};

/**
 * Test the new hCaptcha and reCAPTCHA v3 methods.
 */
export const solveNewCaptchaTypesExample = async (
  options: IMultiCaptchaSolverOptions,
): Promise<void> => {
  // Create a new instance of MultiCaptchaSolver
  const solver: MultiCaptchaSolver = new MultiCaptchaSolver(options);

  try {
    // Get the balance of the captcha service
    const balance: number = await solver.getBalance();
    console.info(`Balance on ${options.captchaService}: ${balance}`);

    // Example for hCaptcha
    console.info('--- Testing hCaptcha ---');
    const hCaptchaResult = await solver.solveHCaptcha(
      'https://accounts.hcaptcha.com/demo',
      '4c672d35-0701-42b2-88c3-78380b0db560',
    );
    console.info(`hCaptcha solution: ${hCaptchaResult}`);

    // Example for reCAPTCHA v3
    console.info('--- Testing reCAPTCHA v3 ---');
    const recaptchaV3Result = await solver.solveRecaptchaV3(
      'https://www.google.com/recaptcha/api2/demo',
      '6Le-wvkSAAAAAPBMRTvw0Q4Muexq1bi0DJwx_mJ-',
      0.3, // minimum score
      'verify', // page action
    );
    console.info(`reCAPTCHA v3 solution: ${recaptchaV3Result}`);
  } catch (error) {
    console.error('Error solving captchas:', error);
  }
};

/**
 * Test the new CapMonster Cloud service provider.
 */
export const solveCapMonsterExample = async (): Promise<void> => {
  console.info('--- Testing CapMonster Cloud ---');

  // Create a new instance of MultiCaptchaSolver with CapMonster
  const solver: MultiCaptchaSolver = new MultiCaptchaSolver(capMonsterOptions);

  try {
    // Get the balance of CapMonster Cloud service
    const balance: number = await solver.getBalance();
    console.info(`Balance on CapMonster Cloud: ${balance}`);

    // Solve image captcha with CapMonster
    const imageSolution: string = await solver.solveImageCaptcha(base64string);
    console.info(`Image captcha solution with CapMonster: ${imageSolution}`);

    // Test hCaptcha with CapMonster
    const hCaptchaResult = await solver.solveHCaptcha(
      'https://accounts.hcaptcha.com/demo',
      '4c672d35-0701-42b2-88c3-78380b0db560',
    );
    console.info(`hCaptcha solution with CapMonster: ${hCaptchaResult}`);

    // Test reCAPTCHA v3 with CapMonster (proxyless)
    const recaptchaV3Result = await solver.solveRecaptchaV3(
      'https://www.google.com/recaptcha/api2/demo',
      '6Le-wvkSAAAAAPBMRTvw0Q4Muexq1bi0DJwx_mJ-',
      0.7, // minimum score
      'homepage', // page action
    );
    console.info(`reCAPTCHA v3 solution with CapMonster: ${recaptchaV3Result}`);
  } catch (error) {
    console.error('Error solving captchas with CapMonster:', error);
  }
};

// Run the example
solveCaptchaExample(options);
// Uncomment to test the new captcha types
// solveNewCaptchaTypesExample(options);
// Uncomment to test CapMonster Cloud
// solveCapMonsterExample();
