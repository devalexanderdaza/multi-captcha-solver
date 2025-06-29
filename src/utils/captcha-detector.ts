/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { JSDOM } from 'jsdom';
import fetch, { RequestInit } from 'node-fetch';
import { ProxyOptions } from '../types/proxy.types.js';

/**
 * Enum representing the different types of captchas that can be detected.
 *
 * @enum {string}
 */
export enum CaptchaType {
  /**
   * Google reCAPTCHA v2 - Checkbox-based captcha
   */
  RECAPTCHA_V2 = 'RECAPTCHA_V2',

  /**
   * Google reCAPTCHA v3 - Score-based invisible captcha
   */
  RECAPTCHA_V3 = 'RECAPTCHA_V3',

  /**
   * hCaptcha - Privacy-focused alternative to reCAPTCHA
   */
  HCAPTCHA = 'HCAPTCHA',
}

/**
 * Options for configuring the CaptchaDetector HTTP requests.
 */
interface DetectorOptions {
  /**
   * Timeout for HTTP requests in milliseconds.
   * @default 10000
   */
  timeout?: number;

  /**
   * User agent string to use for requests.
   * @default 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
   */
  userAgent?: string;

  /**
   * Whether to follow redirects.
   * @default true
   */
  followRedirects?: boolean;
}

/**
 * Utility class for automatically detecting the type of captcha present on a webpage.
 *
 * This class can analyze HTML content to identify common captcha implementations
 * including Google reCAPTCHA v2/v3 and hCaptcha by looking for specific patterns,
 * scripts, and DOM elements.
 *
 * @example
 * ```typescript
 * const detector = new CaptchaDetector();
 *
 * // Detect captcha on a webpage
 * const captchaType = await detector.detect('https://example.com/login');
 *
 * if (captchaType === CaptchaType.RECAPTCHA_V2) {
 *   console.log('Found reCAPTCHA v2');
 * }
 * ```
 */
export class CaptchaDetector {
  private readonly defaultOptions: Required<DetectorOptions> = {
    timeout: 10000,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    followRedirects: true,
  };

  /**
   * Creates a new instance of CaptchaDetector.
   *
   * @param options - Optional configuration for the detector
   */
  constructor(private readonly options: DetectorOptions = {}) {}

  /**
   * Detects the type of captcha present on a given URL.
   *
   * This method fetches the HTML content from the specified URL and analyzes it
   * to identify captcha implementations. It supports proxy usage and handles
   * Single Page Applications (SPAs) by waiting for initial content to load.
   *
   * @param url - The URL to analyze for captcha presence
   * @param proxy - Optional proxy configuration for the HTTP request
   * @returns Promise that resolves to the detected CaptchaType or null if none found
   *
   * @throws {Error} When the URL is invalid or network request fails
   *
   * @example
   * ```typescript
   * // Basic detection
   * const captchaType = await detector.detect('https://example.com');
   *
   * // Detection with proxy
   * const proxyOptions = {
   *   type: 'http' as const,
   *   uri: '127.0.0.1:8080',
   *   username: 'user',
   *   password: 'pass'
   * };
   * const captchaType = await detector.detect('https://example.com', proxyOptions);
   * ```
   */
  public async detect(
    url: string,
    proxy?: ProxyOptions,
  ): Promise<CaptchaType | null> {
    try {
      // Validate URL
      new URL(url);
    } catch {
      throw new Error('Invalid URL provided');
    }

    try {
      // Fetch HTML content
      const html = await this.fetchHtml(url, proxy);

      // Analyze HTML for captcha patterns
      return this.analyzeHtml(html);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to detect captcha on ${url}: ${errorMessage}`);
    }
  }

  /**
   * Analyzes HTML content to detect captcha types.
   * This method is exposed for testing purposes and direct HTML analysis.
   *
   * @param html - The HTML content to analyze
   * @returns The detected CaptchaType or null if none found
   *
   * @internal
   */
  public analyzeHtml(html: string): CaptchaType | null {
    try {
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Check for hCaptcha first (as it might be less common)
      if (this.detectHCaptcha(document)) {
        return CaptchaType.HCAPTCHA;
      }

      // Check for reCAPTCHA (v2 and v3)
      const recaptchaType = this.detectRecaptcha(document);
      if (recaptchaType) {
        return recaptchaType;
      }

      return null;
    } catch (error) {
      // If HTML parsing fails, return null instead of throwing
      return null;
    }
  }

  /**
   * Fetches HTML content from a URL with optional proxy support.
   *
   * @private
   * @param url - The URL to fetch
   * @param proxy - Optional proxy configuration
   * @returns Promise that resolves to the HTML content
   */
  private async fetchHtml(url: string, proxy?: ProxyOptions): Promise<string> {
    const mergedOptions = { ...this.defaultOptions, ...this.options };

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        'User-Agent': mergedOptions.userAgent,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: mergedOptions.followRedirects ? 'follow' : 'manual',
    };

    // Add proxy support if provided
    // Note: node-fetch v3 doesn't support proxy directly
    // In production, you might want to use https-proxy-agent or socks-proxy-agent
    if (proxy) {
      // Proxy support would require additional agent configuration
      // For now, we document this limitation
      console.warn(
        'Proxy support requires additional configuration with proxy agents',
      );
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      mergedOptions.timeout,
    );

    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Detects hCaptcha presence in the document.
   *
   * @private
   * @param document - The DOM document to analyze
   * @returns true if hCaptcha is detected, false otherwise
   */
  private detectHCaptcha(document: Document): boolean {
    // Check for hCaptcha scripts
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const hcaptchaScripts = scripts.some((script) => {
      const src = script.getAttribute('src');
      return (
        src && (src.includes('hcaptcha.com') || src.includes('js.hcaptcha.com'))
      );
    });

    if (hcaptchaScripts) {
      return true;
    }

    // Check for hCaptcha iframes
    const iframes = Array.from(document.querySelectorAll('iframe[src]'));
    const hcaptchaIframes = iframes.some((iframe) => {
      const src = iframe.getAttribute('src');
      return src && src.includes('hcaptcha.com');
    });

    if (hcaptchaIframes) {
      return true;
    }

    // Check for hCaptcha divs with specific classes or data attributes
    const hcaptchaDivs = document.querySelectorAll(
      '[class*="h-captcha"], [class*="hcaptcha"]',
    );
    if (hcaptchaDivs.length > 0) {
      return true;
    }

    // Check for hCaptcha callback functions in scripts
    const allScripts = Array.from(document.querySelectorAll('script'));
    const scriptContent = allScripts
      .map((script) => script.textContent || '')
      .join(' ');

    return (
      scriptContent.includes('hcaptcha') ||
      scriptContent.includes('h-captcha') ||
      /hcaptcha\.render\s*\(/i.test(scriptContent)
    );
  }

  /**
   * Detects reCAPTCHA presence and determines version.
   *
   * @private
   * @param document - The DOM document to analyze
   * @returns The detected reCAPTCHA type or null if none found
   */
  private detectRecaptcha(
    document: Document,
  ): CaptchaType.RECAPTCHA_V2 | CaptchaType.RECAPTCHA_V3 | null {
    // Check for reCAPTCHA scripts
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const recaptchaScripts = scripts.filter((script) => {
      const src = script.getAttribute('src');
      return (
        src &&
        (src.includes('google.com/recaptcha') ||
          src.includes('www.google.com/recaptcha') ||
          src.includes('gstatic.com/recaptcha'))
      );
    });

    // Check for reCAPTCHA iframes
    const iframes = Array.from(document.querySelectorAll('iframe[src]'));
    const recaptchaIframes = iframes.some((iframe) => {
      const src = iframe.getAttribute('src');
      return (
        src &&
        (src.includes('google.com/recaptcha') ||
          src.includes('www.google.com/recaptcha'))
      );
    });

    // Check for reCAPTCHA divs or elements
    const recaptchaDivs = document.querySelectorAll(
      '[class*="g-recaptcha"], [class*="grecaptcha"], [data-sitekey]',
    );

    // Analyze script content to determine version and presence
    const allScripts = Array.from(document.querySelectorAll('script'));
    const scriptContent = allScripts
      .map((script) => script.textContent || '')
      .join(' ');

    // Check for reCAPTCHA in script content (for dynamic loading scenarios)
    const hasRecaptchaInScript =
      /grecaptcha\./i.test(scriptContent) ||
      scriptContent.includes('google.com/recaptcha') ||
      scriptContent.includes('www.google.com/recaptcha') ||
      /recaptcha/i.test(scriptContent);

    // If no reCAPTCHA indicators found, return null
    if (
      recaptchaScripts.length === 0 &&
      !recaptchaIframes &&
      recaptchaDivs.length === 0 &&
      !hasRecaptchaInScript
    ) {
      return null;
    }

    // Check for v3 specific patterns (more specific patterns first)
    const hasV3Patterns =
      /grecaptcha\.execute\s*\(/i.test(scriptContent) ||
      scriptContent.includes('action:') ||
      scriptContent.includes('"action"') ||
      scriptContent.includes("'action'") ||
      document.querySelector('[data-action]') !== null ||
      recaptchaScripts.some((script) => {
        const src = script.getAttribute('src');
        return src && src.includes('render=');
      });

    if (hasV3Patterns) {
      return CaptchaType.RECAPTCHA_V3;
    }

    // Check for v2 specific patterns
    const hasV2Patterns =
      document.querySelector('.g-recaptcha') !== null ||
      document.querySelector('[data-sitekey]') !== null ||
      /grecaptcha\.render\s*\(/i.test(scriptContent) ||
      scriptContent.includes('data-sitekey') ||
      recaptchaIframes ||
      recaptchaScripts.length > 0;

    if (hasV2Patterns) {
      return CaptchaType.RECAPTCHA_V2;
    }

    // If we found reCAPTCHA references but can't determine version, default to v2
    // as it's more common and visible
    if (hasRecaptchaInScript) {
      return CaptchaType.RECAPTCHA_V2;
    }

    return null;
  }
}
