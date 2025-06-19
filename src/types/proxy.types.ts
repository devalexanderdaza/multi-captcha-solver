/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

/**
 * Configuration options for proxy settings when solving web-based captchas.
 * Used to route traffic through a proxy server for enhanced privacy or to bypass restrictions.
 *
 * @interface ProxyOptions
 * @example
 * ```typescript
 * const proxy: ProxyOptions = {
 *   type: 'http',
 *   uri: '127.0.0.1:8080',
 *   username: 'proxy_user',
 *   password: 'proxy_pass'
 * };
 *
 * const token = await solver.solveRecaptchaV2(
 *   'https://example.com',
 *   'site-key',
 *   proxy
 * );
 * ```
 */
export interface ProxyOptions {
  /**
   * The type of proxy protocol to use.
   * Choose based on your proxy server configuration.
   */
  type: 'http' | 'https' | 'socks4' | 'socks5';

  /**
   * The proxy URI in format "host:port" or "ip:port".
   *
   * @example "127.0.0.1:8080" or "proxy.example.com:3128"
   */
  uri: string;

  /**
   * Optional username for proxy authentication.
   * Required if your proxy server uses authentication.
   */
  username?: string;

  /**
   * Optional password for proxy authentication.
   * Required if your proxy server uses authentication.
   */
  password?: string;
}
