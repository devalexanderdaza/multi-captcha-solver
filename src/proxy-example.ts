/**
 * Example usage of MultiCaptchaSolver with Proxy Support
 *
 * This example demonstrates how to use the library with proxy configuration
 * for solving captchas when you need to route traffic through a proxy server.
 */

import {
  ECaptchaSolverService,
  MultiCaptchaSolver,
  ProxyOptions,
} from './main.js';

async function solveCaptchaWithProxyExample(): Promise<void> {
  // Configure your captcha solver
  const solver = new MultiCaptchaSolver({
    apiKey: 'your-api-key-here', // Replace with your actual API key
    captchaService: ECaptchaSolverService.AntiCaptcha, // or ECaptchaSolverService.TwoCaptcha
    retries: 3, // Number of retries on failure (optional, default: 3)
  });

  // Configure proxy options
  const proxyOptions: ProxyOptions = {
    type: 'http', // 'http', 'https', 'socks4', or 'socks5'
    uri: '127.0.0.1:8080', // proxy host:port
    username: 'proxy_username', // optional
    password: 'proxy_password', // optional
  };

  try {
    // Get account balance
    console.log('Getting account balance...');
    const balance = await solver.getBalance();
    console.log(`Account balance: $${balance}`);

    // Solve reCAPTCHA v2 with proxy
    console.log('Solving reCAPTCHA v2 with proxy...');
    const recaptchaV2Token = await solver.solveRecaptchaV2(
      'https://www.google.com/recaptcha/api2/demo',
      '6Le-wvkSAAAAAPBMRTvw0Q4Muexq1bi0DJwx_mJ-',
      proxyOptions, // Pass proxy configuration
    );
    console.log('reCAPTCHA v2 token:', recaptchaV2Token);

    // Solve hCaptcha with proxy
    console.log('Solving hCaptcha with proxy...');
    const hcaptchaToken = await solver.solveHCaptcha(
      'https://accounts.hcaptcha.com/demo',
      '4c672d35-0701-42b2-88c3-78380b0db560',
      proxyOptions, // Pass proxy configuration
    );
    console.log('hCaptcha token:', hcaptchaToken);

    // Solve reCAPTCHA v3 with proxy
    console.log('Solving reCAPTCHA v3 with proxy...');
    const recaptchaV3Token = await solver.solveRecaptchaV3(
      'https://www.google.com/recaptcha/api2/demo',
      '6Le-wvkSAAAAAPBMRTvw0Q4Muexq1bi0DJwx_mJ-',
      0.3, // minimum score (0.1 to 0.9)
      'verify', // page action
      proxyOptions, // Pass proxy configuration
    );
    console.log('reCAPTCHA v3 token:', recaptchaV3Token);

    // You can also solve captchas without proxy by omitting the last parameter
    console.log('Solving reCAPTCHA v2 without proxy...');
    const tokenWithoutProxy = await solver.solveRecaptchaV2(
      'https://www.google.com/recaptcha/api2/demo',
      '6Le-wvkSAAAAAPBMRTvw0Q4Muexq1bi0DJwx_mJ-',
      // No proxy parameter = no proxy used
    );
    console.log('reCAPTCHA v2 token (no proxy):', tokenWithoutProxy);
  } catch (error) {
    console.error('Error solving captcha:', error);
  }
}

// Run the example
solveCaptchaWithProxyExample().catch(console.error);
