# ✨ Multi-Captcha Solver Adapter ✨

[![NPM Version](https://img.shields.io/npm/v/multi-captcha-solver-adapter?style=for-the-badge)](https://www.npmjs.com/package/multi-captcha-solver-adapter)
[![Build Status](https://img.shields.io/github/actions/workflow/status/devalexanderdaza/multi-captcha-solver/build.yml?branch=main&style=for-the-badge)](https://github.com/devalexanderdaza/multi-captcha-solver/actions/workflows/build.yml)
[![NPM Downloads](https://img.shields.io/npm/dt/multi-captcha-solver-adapter?style=for-the-badge)](https://www.npmjs.com/package/multi-captcha-solver-adapter)
[![License](https://img.shields.io/github/license/devalexanderdaza/multi-captcha-solver?style=for-the-badge)](./LICENSE)
[![Contributors](https://img.shields.io/github/contributors/devalexanderdaza/multi-captcha-solver?style=for-the-badge)](https://github.com/devalexanderdaza/multi-captcha-solver/graphs/contributors)

A powerful and easy-to-use NodeJS library that unifies multiple captcha-solving services under a single, elegant, and robust interface.

---

## 🚀 Key Features

- **🧩 Multi-Provider Support**: Built-in support for the most popular captcha services.
- **🛡️ Unified Interface**: Use the same code to talk to different services. Switch providers by changing just one line!
- **🦾 Resilient & Robust**: Automatic retry system with exponential backoff and custom error handling.
- **🧠 Intelligent Retry Logic**: Smart retry system that avoids unnecessary retries on permanent errors like invalid API keys.
- **🌐 Modern Support**: Solves ImageToText, reCAPTCHA v2/v3, hCaptcha and more.
- **🕵️ Proxy Support**: Send your proxies to solving services for complex scraping tasks.
- **💯 Strictly Typed**: Developed 100% in TypeScript for safer and more predictable code.

## 🛠️ Supported Services

- [x] 2Captcha
- [x] Anti-Captcha
- _... and more coming soon!_

## 📦 Installation

```bash
npm install multi-captcha-solver-adapter
```

## 👨‍💻 Usage Examples

### Basic Usage: Solving an Image Captcha

```typescript
import { MultiCaptchaSolver, ECaptchaSolverService } from 'multi-captcha-solver-adapter';

const imageBase64 = '...'; // your captcha image in base64

async function solveImage() {
  const solver = new MultiCaptchaSolver({
    apiKey: 'YOUR_PROVIDER_API_KEY',
    captchaService: ECaptchaSolverService.TwoCaptcha,
  });

  try {
    const solution = await solver.solveImageCaptcha(imageBase64);
    console.log(`🎉 The solution is: ${solution}`);
  } catch (error) {
    console.error('😱 An error occurred:', error);
  }
}

solveImage();
```

### Advanced Usage: reCAPTCHA v3 with Proxies and Error Handling

```typescript
import {
  MultiCaptchaSolver,
  ECaptchaSolverService,
  // Import custom errors for detailed handling!
  InvalidApiKeyError,
  InsufficientBalanceError,
  CaptchaServiceError,
  ProxyOptions
} from 'multi-captcha-solver-adapter';

async function solveAdvanced() {
  const solver = new MultiCaptchaSolver({
    apiKey: 'YOUR_PROVIDER_API_KEY',
    captchaService: ECaptchaSolverService.AntiCaptcha,
    retries: 3, // Optional: number of retries
  });

  const proxy: ProxyOptions = {
    type: 'http',
    uri: '127.0.0.1:8888',
    username: 'proxy_user', // optional
    password: 'proxy_pass', // optional
  };

  try {
    const balance = await solver.getBalance();
    console.log(`Current balance: $${balance}`);

    const token = await solver.solveRecaptchaV3(
      'https://my-target-website.com',
      'google-site-key-here',
      0.7, // minScore
      'homepage_action', // pageAction
      proxy
    );
    console.log(`reCAPTCHA v3 token obtained: ${token.substring(0, 30)}...`);

  } catch (error) {
    if (error instanceof InvalidApiKeyError) {
      console.error(`API Key is invalid for ${error.service}.`);
    } else if (error instanceof InsufficientBalanceError) {
      console.error(`Insufficient balance in ${error.service}.`);
    } else if (error instanceof CaptchaServiceError) {
      console.error(`API error from ${error.service}: ${error.message}`);
    } else {
      console.error('😱 An unexpected error occurred:', error);
    }
  }
}

solveAdvanced();
```

## 🎯 Supported Captcha Types

### Image Captcha

Solve traditional image-based captchas:

```typescript
const solution = await solver.solveImageCaptcha(base64ImageString);
```

### reCAPTCHA v2

Solve Google's reCAPTCHA v2 challenges:

```typescript
const token = await solver.solveRecaptchaV2(
  'https://example.com',  // Website URL
  'site-key-here',        // Google site key
  proxy                   // Optional: proxy configuration
);
```

### reCAPTCHA v3

Solve Google's reCAPTCHA v3 challenges:

```typescript
const token = await solver.solveRecaptchaV3(
  'https://example.com',  // Website URL
  'site-key-here',        // Google site key
  0.7,                    // Minimum score (0.1 to 0.9)
  'submit',               // Page action
  proxy                   // Optional: proxy configuration
);
```

### hCaptcha

Solve hCaptcha challenges:

```typescript
const token = await solver.solveHCaptcha(
  'https://example.com',  // Website URL
  'site-key-here',        // hCaptcha site key
  proxy                   // Optional: proxy configuration
);
```

## 🔄 Intelligent Retry Logic

The library includes a sophisticated retry system with exponential backoff and intelligent error handling that automatically distinguishes between retryable and non-retryable errors.

### Automatic Retry Behavior

```typescript
const solver = new MultiCaptchaSolver({
  apiKey: 'YOUR_API_KEY',
  captchaService: ECaptchaSolverService.TwoCaptcha,
  retries: 5, // Will retry up to 5 times (default: 3)
});

// The solver will automatically retry failed requests with increasing delays
const token = await solver.solveRecaptchaV2('https://example.com', 'site-key');
```

### Smart Error Classification

The library intelligently handles different types of errors:

**✅ Will Retry (Network/Temporary Errors):**

- Network timeouts and connection errors
- Temporary server errors (5xx HTTP status codes)
- Generic errors that might be transient

**❌ Won't Retry (Permanent API Errors):**

- `InvalidApiKeyError` - Invalid or malformed API key
- `InsufficientBalanceError` - Account has no balance
- `IpBlockedError` - IP address is blocked by the service
- Other specific `CaptchaServiceError` instances

### Benefits of Intelligent Retries

```typescript
import {
  MultiCaptchaSolver,
  ECaptchaSolverService,
  InvalidApiKeyError,
  InsufficientBalanceError
} from 'multi-captcha-solver-adapter';

async function demonstrateIntelligentRetries() {
  const solver = new MultiCaptchaSolver({
    apiKey: 'INVALID_KEY', // This will cause an InvalidApiKeyError
    captchaService: ECaptchaSolverService.TwoCaptcha,
    retries: 3
  });

  try {
    // This will fail immediately without retries because API key is invalid
    const token = await solver.solveRecaptchaV2('https://example.com', 'site-key');
  } catch (error) {
    if (error instanceof InvalidApiKeyError) {
      console.log('❌ API key error detected - no retries attempted (saves time!)');
    }
  }
}
```

### Retry Configuration

```typescript
// Conservative retry configuration
const conservativeSolver = new MultiCaptchaSolver({
  apiKey: 'YOUR_API_KEY',
  captchaService: ECaptchaSolverService.AntiCaptcha,
  retries: 2 // Fewer retries for faster failures
});

// Aggressive retry configuration  
const aggressiveSolver = new MultiCaptchaSolver({
  apiKey: 'YOUR_API_KEY',
  captchaService: ECaptchaSolverService.TwoCaptcha,
  retries: 5 // More retries for higher success rate
});
```

## 🕵️ Proxy Support

Configure proxies for solving web-based captchas:

```typescript
import { ProxyOptions } from 'multi-captcha-solver-adapter';

const proxyConfig: ProxyOptions = {
  type: 'http',           // 'http', 'https', 'socks4', or 'socks5'
  uri: '127.0.0.1:8080',  // proxy host:port
  username: 'user',       // optional authentication
  password: 'pass',       // optional authentication
};

// Use proxy with any web-based captcha
const token = await solver.solveRecaptchaV2(
  'https://example.com',
  'site-key',
  proxyConfig
);
```

## 🛡️ Error Handling & Retry Behavior

The library provides specific error types for better error handling and implements intelligent retry logic based on error types:

```typescript
import {
  MultiCaptchaError,        // Base error class
  CaptchaServiceError,      // General API errors (won't retry)
  InvalidApiKeyError,       // Invalid API key (won't retry)
  InsufficientBalanceError, // Not enough balance (won't retry)
  IpBlockedError,          // IP address blocked (won't retry)
} from 'multi-captcha-solver-adapter';

try {
  const token = await solver.solveRecaptchaV2('https://example.com', 'site-key');
} catch (error) {
  if (error instanceof InvalidApiKeyError) {
    console.error(`❌ Invalid API key for ${error.service} - No retries attempted`);
  } else if (error instanceof InsufficientBalanceError) {
    console.error(`💰 Insufficient balance in ${error.service} - No retries attempted`);
  } else if (error instanceof IpBlockedError) {
    console.error(`🚫 IP blocked by ${error.service} - No retries attempted`);
  } else if (error instanceof CaptchaServiceError) {
    console.error(`🔧 API error in ${error.service}: ${error.message} - No retries attempted`);
  } else if (error instanceof MultiCaptchaError) {
    console.error(`📚 Library error: ${error.message}`);
  } else {
    console.error(`🔄 Network/Generic error: ${error.message} - May have been retried`);
  }
}
```

### Error Classification for Retries

Understanding which errors trigger retries helps you build more efficient applications:

```typescript
async function handleDifferentErrorTypes() {
  const solver = new MultiCaptchaSolver({
    apiKey: 'YOUR_API_KEY',
    captchaService: ECaptchaSolverService.TwoCaptcha,
    retries: 3
  });

  try {
    const token = await solver.solveRecaptchaV2('https://example.com', 'site-key');
    console.log('✅ Success:', token);
  } catch (error) {
    // Check if this error type would have triggered retries
    const isRetryableError = !(error instanceof CaptchaServiceError);
    
    if (isRetryableError) {
      console.log('🔄 This error was retried automatically');
    } else {
      console.log('⚡ This error failed immediately (no retries)');
    }
    
    throw error; // Re-throw for application handling
  }
}
  } else if (error instanceof MultiCaptchaError) {
    console.error(`Library error: ${error.message}`);
  }
}
```

## 🔧 API Reference

### MultiCaptchaSolver

#### Constructor

```typescript
new MultiCaptchaSolver(options: IMultiCaptchaSolverOptions)
```

**Options:**

- `apiKey: string` - Your captcha service API key
- `captchaService: ECaptchaSolverService` - The service to use
- `retries?: number` - Number of retries (default: 3)

#### Methods

- `getBalance(): Promise<number>` - Get account balance
- `solveImageCaptcha(base64string: string): Promise<string>` - Solve image captcha
- `solveRecaptchaV2(websiteURL: string, websiteKey: string, proxy?: ProxyOptions): Promise<string>` - Solve reCAPTCHA v2
- `solveRecaptchaV3(websiteURL: string, websiteKey: string, minScore: number, pageAction: string, proxy?: ProxyOptions): Promise<string>` - Solve reCAPTCHA v3
- `solveHCaptcha(websiteURL: string, websiteKey: string, proxy?: ProxyOptions): Promise<string>` - Solve hCaptcha

#### Supported Services

- `ECaptchaSolverService.TwoCaptcha` - 2Captcha service
- `ECaptchaSolverService.AntiCaptcha` - Anti-Captcha service

## 📚 Examples

Check out the [examples](./examples/) directory for complete working examples:

- **[Basic Example](./examples/example.ts)** - Basic usage for all captcha types
- **[Proxy Example](./examples/proxy-example.ts)** - Advanced usage with proxy configuration

## 💖 Contributing

Contributions are the heart of the open-source community! We are delighted to accept your help. Please check out our **[Contribution Guide](./CONTRIBUTING.md)** to get started.

## 📄 License

This project is licensed under the Apache-2.0 License. See the [LICENSE](./LICENSE) file for details.

---

### Author

#### Neyib Alexander Daza Guerrero

- **Email**: [dev.alexander.daza@gmail.com](mailto:dev.alexander.daza@gmail.com)
- **GitHub**: [@devalexanderdaza](https://github.com/devalexanderdaza)
