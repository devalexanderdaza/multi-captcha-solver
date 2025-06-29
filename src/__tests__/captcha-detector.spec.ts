/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { CaptchaDetector, CaptchaType } from '../utils/captcha-detector.js';

// Mock node-fetch to avoid making real HTTP requests
jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('CaptchaDetector', () => {
  let detector: CaptchaDetector;

  beforeEach(() => {
    detector = new CaptchaDetector();
    jest.clearAllMocks();
  });

  describe('analyzeHtml', () => {
    describe('reCAPTCHA v2 detection', () => {
      it('should detect reCAPTCHA v2 from script with google.com/recaptcha', () => {
        const html = `
          <html>
            <head>
              <script src="https://www.google.com/recaptcha/api.js" async defer></script>
            </head>
            <body>
              <div class="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V2);
      });

      it('should detect reCAPTCHA v2 from iframe', () => {
        const html = `
          <html>
            <body>
              <iframe src="https://www.google.com/recaptcha/api2/anchor" name="a-123" width="304" height="78"></iframe>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V2);
      });

      it('should detect reCAPTCHA v2 from div with g-recaptcha class', () => {
        const html = `
          <html>
            <body>
              <div class="g-recaptcha" data-sitekey="site-key-here"></div>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V2);
      });

      it('should detect reCAPTCHA v2 from grecaptcha.render in script', () => {
        const html = `
          <html>
            <head>
              <script>
                grecaptcha.render('recaptcha-container', {
                  'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                });
              </script>
            </head>
            <body>
              <div id="recaptcha-container"></div>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V2);
      });

      it('should detect reCAPTCHA v2 from data-sitekey attribute', () => {
        const html = `
          <html>
            <body>
              <div data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V2);
      });
    });

    describe('reCAPTCHA v3 detection', () => {
      it('should detect reCAPTCHA v3 from grecaptcha.execute in script', () => {
        const html = `
          <html>
            <head>
              <script src="https://www.google.com/recaptcha/api.js?render=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></script>
              <script>
                grecaptcha.ready(function() {
                  grecaptcha.execute('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', {action: 'submit'})
                  .then(function(token) {
                    console.log(token);
                  });
                });
              </script>
            </head>
            <body>
              <form>
                <input type="submit" value="Submit">
              </form>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V3);
      });

      it('should detect reCAPTCHA v3 from action attribute', () => {
        const html = `
          <html>
            <head>
              <script src="https://www.google.com/recaptcha/api.js"></script>
            </head>
            <body>
              <div data-action="login"></div>
              <script>
                grecaptcha.execute('site-key', {action: 'login'});
              </script>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V3);
      });

      it('should detect reCAPTCHA v3 from action in JSON format', () => {
        const html = `
          <html>
            <head>
              <script src="https://www.google.com/recaptcha/api.js"></script>
              <script>
                const config = {
                  "sitekey": "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
                  "action": "homepage"
                };
                grecaptcha.execute(config.sitekey, {action: config.action});
              </script>
            </head>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V3);
      });
    });

    describe('hCaptcha detection', () => {
      it('should detect hCaptcha from script with hcaptcha.com', () => {
        const html = `
          <html>
            <head>
              <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
            </head>
            <body>
              <div class="h-captcha" data-sitekey="10000000-ffff-ffff-ffff-000000000001"></div>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.HCAPTCHA);
      });

      it('should detect hCaptcha from iframe', () => {
        const html = `
          <html>
            <body>
              <iframe src="https://newassets.hcaptcha.com/captcha/v1/abc123/checkbox" width="300" height="65"></iframe>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.HCAPTCHA);
      });

      it('should detect hCaptcha from div with h-captcha class', () => {
        const html = `
          <html>
            <body>
              <div class="h-captcha" data-sitekey="10000000-ffff-ffff-ffff-000000000001"></div>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.HCAPTCHA);
      });

      it('should detect hCaptcha from script content', () => {
        const html = `
          <html>
            <head>
              <script>
                function onloadCallback() {
                  hcaptcha.render('hcaptcha-container', {
                    'sitekey': '10000000-ffff-ffff-ffff-000000000001'
                  });
                }
              </script>
            </head>
            <body>
              <div id="hcaptcha-container"></div>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.HCAPTCHA);
      });

      it('should detect hCaptcha with alternative class naming', () => {
        const html = `
          <html>
            <body>
              <div class="hcaptcha-widget" data-sitekey="10000000-ffff-ffff-ffff-000000000001"></div>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.HCAPTCHA);
      });
    });

    describe('no captcha detection', () => {
      it('should return null when no captcha is found', () => {
        const html = `
          <html>
            <head>
              <title>Regular Page</title>
            </head>
            <body>
              <h1>Welcome</h1>
              <p>This is a regular page without any captcha.</p>
              <form>
                <input type="text" name="username">
                <input type="password" name="password">
                <input type="submit" value="Login">
              </form>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBeNull();
      });

      it('should return null for empty HTML', () => {
        const html = '';
        const result = detector.analyzeHtml(html);
        expect(result).toBeNull();
      });

      it('should return null for invalid HTML', () => {
        const html = '<invalid html';
        const result = detector.analyzeHtml(html);
        expect(result).toBeNull();
      });

      it('should return null for HTML with false positive keywords', () => {
        const html = `
          <html>
            <body>
              <p>This page talks about captcha technology but doesn't have one.</p>
              <p>We use recaptcha on our other pages.</p>
              <p>hcaptcha is a privacy-focused alternative.</p>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBeNull();
      });
    });

    describe('priority detection', () => {
      it('should prioritize hCaptcha over reCAPTCHA when both are present', () => {
        const html = `
          <html>
            <head>
              <script src="https://www.google.com/recaptcha/api.js"></script>
              <script src="https://js.hcaptcha.com/1/api.js"></script>
            </head>
            <body>
              <div class="g-recaptcha" data-sitekey="recaptcha-key"></div>
              <div class="h-captcha" data-sitekey="hcaptcha-key"></div>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.HCAPTCHA);
      });

      it('should correctly identify reCAPTCHA v3 over v2 when v3 patterns are present', () => {
        const html = `
          <html>
            <head>
              <script src="https://www.google.com/recaptcha/api.js"></script>
            </head>
            <body>
              <div class="g-recaptcha" data-sitekey="site-key"></div>
              <script>
                // This should indicate v3 despite v2 elements being present
                grecaptcha.execute('site-key', {action: 'submit'});
              </script>
            </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V3);
      });
    });

    describe('real-world scenarios', () => {
      it('should detect reCAPTCHA in a complex login form', () => {
        const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
            <script src="https://www.google.com/recaptcha/api.js" async defer></script>
          </head>
          <body>
            <div class="container">
              <form id="loginForm" method="post" action="/login">
                <div class="form-group">
                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                  <label for="password">Password:</label>
                  <input type="password" id="password" name="password" required>
                </div>
                <div class="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
                <button type="submit">Login</button>
              </form>
            </div>
          </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V2);
      });

      it('should detect hCaptcha in a registration form', () => {
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
          </head>
          <body>
            <form>
              <input type="text" name="username" placeholder="Username">
              <input type="email" name="email" placeholder="Email">
              <input type="password" name="password" placeholder="Password">
              <div class="h-captcha" data-sitekey="10000000-ffff-ffff-ffff-000000000001" data-callback="onSubmit"></div>
              <button type="submit">Register</button>
            </form>
          </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.HCAPTCHA);
      });

      it('should handle SPA-like content with dynamic script injection', () => {
        const html = `
          <html>
          <head>
            <script>
              // Simulating dynamic script loading
              (function() {
                var script = document.createElement('script');
                script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
                document.head.appendChild(script);

                window.onRecaptchaLoad = function() {
                  grecaptcha.render('recaptcha-container', {
                    sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
                    callback: function(response) {
                      console.log('Captcha solved');
                    }
                  });
                };
              })();
            </script>
          </head>
          <body>
            <div id="app">
              <div id="recaptcha-container"></div>
            </div>
          </body>
          </html>
        `;

        const result = detector.analyzeHtml(html);
        expect(result).toBe(CaptchaType.RECAPTCHA_V2);
      });
    });
  });

  describe('detect method', () => {
    it('should throw error for invalid URL', async () => {
      await expect(detector.detect('invalid-url')).rejects.toThrow(
        'Invalid URL provided',
      );
    });

    it('should throw error for malformed URL', async () => {
      await expect(detector.detect('not-a-url')).rejects.toThrow(
        'Invalid URL provided',
      );
    });

    // Note: These tests would require mocking fetch, which is already done at the module level
    // In a real implementation, you would mock successful responses and test the integration
  });

  describe('constructor', () => {
    it('should create instance with default options', () => {
      const newDetector = new CaptchaDetector();
      expect(newDetector).toBeInstanceOf(CaptchaDetector);
    });

    it('should create instance with custom options', () => {
      const options = {
        timeout: 5000,
        userAgent: 'Custom User Agent',
        followRedirects: false,
      };
      const newDetector = new CaptchaDetector(options);
      expect(newDetector).toBeInstanceOf(CaptchaDetector);
    });
  });
});
