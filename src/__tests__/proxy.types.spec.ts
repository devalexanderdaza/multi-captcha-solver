/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { ProxyOptions } from '../types/proxy.types.js';

describe('ProxyOptions', () => {
  it('should define ProxyOptions interface correctly', () => {
    const proxyOptions: ProxyOptions = {
      type: 'http',
      uri: '127.0.0.1:8080',
      username: 'testuser',
      password: 'testpass',
    };

    expect(proxyOptions.type).toBe('http');
    expect(proxyOptions.uri).toBe('127.0.0.1:8080');
    expect(proxyOptions.username).toBe('testuser');
    expect(proxyOptions.password).toBe('testpass');
  });

  it('should allow optional username and password', () => {
    const proxyOptions: ProxyOptions = {
      type: 'socks5',
      uri: '192.168.1.1:1080',
    };

    expect(proxyOptions.type).toBe('socks5');
    expect(proxyOptions.uri).toBe('192.168.1.1:1080');
    expect(proxyOptions.username).toBeUndefined();
    expect(proxyOptions.password).toBeUndefined();
  });

  it('should support all proxy types', () => {
    const httpProxy: ProxyOptions = { type: 'http', uri: '127.0.0.1:8080' };
    const httpsProxy: ProxyOptions = { type: 'https', uri: '127.0.0.1:8443' };
    const socks4Proxy: ProxyOptions = { type: 'socks4', uri: '127.0.0.1:1080' };
    const socks5Proxy: ProxyOptions = { type: 'socks5', uri: '127.0.0.1:1080' };

    expect(httpProxy.type).toBe('http');
    expect(httpsProxy.type).toBe('https');
    expect(socks4Proxy.type).toBe('socks4');
    expect(socks5Proxy.type).toBe('socks5');
  });
});
