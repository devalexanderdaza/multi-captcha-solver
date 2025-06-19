/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

/**
 * Configuration options for proxy settings when solving web-based captchas.
 */
export interface ProxyOptions {
  /** The type of proxy to use */
  type: 'http' | 'https' | 'socks4' | 'socks5';
  /** The proxy URI in format "host:port" or "ip:port" */
  uri: string;
  /** Optional username for proxy authentication */
  username?: string;
  /** Optional password for proxy authentication */
  password?: string;
}
