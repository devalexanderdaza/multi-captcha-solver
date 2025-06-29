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
- [x] CapMonster Cloud
- _... and more coming soon!_

## 📦 Installation

```bash
npm install multi-captcha-solver-adapter
```

## 👨‍💻 Usage Examples

### Basic Usage: Solving an Image Captcha

```typescript
import {
  MultiCaptchaSolver,
  ECaptchaSolverService,
} from 'multi-captcha-solver-adapter';

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
  ProxyOptions,
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
      proxy,
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
  'https://example.com', // Website URL
  'site-key-here', // Google site key
  proxy, // Optional: proxy configuration
);
```

### reCAPTCHA v3

Solve Google's reCAPTCHA v3 challenges:

```typescript
const token = await solver.solveRecaptchaV3(
  'https://example.com', // Website URL
  'site-key-here', // Google site key
  0.7, // Minimum score (0.1 to 0.9)
  'submit', // Page action
  proxy, // Optional: proxy configuration
);
```

### hCaptcha

Solve hCaptcha challenges:

```typescript
const token = await solver.solveHCaptcha(
  'https://example.com', // Website URL
  'site-key-here', // hCaptcha site key
  proxy, // Optional: proxy configuration
);
```

## 🎯 Service-Specific Examples

### Using CapMonster Cloud

CapMonster Cloud offers high-quality captcha solving with competitive pricing:

```typescript
import {
  MultiCaptchaSolver,
  ECaptchaSolverService,
} from 'multi-captcha-solver-adapter';

const solver = new MultiCaptchaSolver({
  apiKey: 'YOUR_CAPMONSTER_API_KEY',
  captchaService: ECaptchaSolverService.CapMonster,
  retries: 3,
});

// CapMonster excels at image captchas
const imageSolution = await solver.solveImageCaptcha(base64Image);

// Supports all modern captcha types
const recaptchaToken = await solver.solveRecaptchaV2(
  'https://example.com',
  'site-key',
);

// reCAPTCHA v3 with high accuracy
const v3Token = await solver.solveRecaptchaV3(
  'https://example.com',
  'site-key',
  0.7,
  'homepage',
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
  InsufficientBalanceError,
} from 'multi-captcha-solver-adapter';

async function demonstrateIntelligentRetries() {
  const solver = new MultiCaptchaSolver({
    apiKey: 'INVALID_KEY', // This will cause an InvalidApiKeyError
    captchaService: ECaptchaSolverService.TwoCaptcha,
    retries: 3,
  });

  try {
    // This will fail immediately without retries because API key is invalid
    const token = await solver.solveRecaptchaV2(
      'https://example.com',
      'site-key',
    );
  } catch (error) {
    if (error instanceof InvalidApiKeyError) {
      console.log(
        '❌ API key error detected - no retries attempted (saves time!)',
      );
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
  retries: 2, // Fewer retries for faster failures
});

// Aggressive retry configuration
const aggressiveSolver = new MultiCaptchaSolver({
  apiKey: 'YOUR_API_KEY',
  captchaService: ECaptchaSolverService.TwoCaptcha,
  retries: 5, // More retries for higher success rate
});
```

## 🕵️ Proxy Support

Configure proxies for solving web-based captchas:

```typescript
import { ProxyOptions } from 'multi-captcha-solver-adapter';

const proxyConfig: ProxyOptions = {
  type: 'http', // 'http', 'https', 'socks4', or 'socks5'
  uri: '127.0.0.1:8080', // proxy host:port
  username: 'user', // optional authentication
  password: 'pass', // optional authentication
};

// Use proxy with any web-based captcha
const token = await solver.solveRecaptchaV2(
  'https://example.com',
  'site-key',
  proxyConfig,
);
```

## 🔍 Automatic Captcha Detection

The library includes a powerful `CaptchaDetector` utility that can automatically identify captcha types present on web pages. This is particularly useful for automation workflows where you need to determine what type of captcha to solve.

### Basic Detection

```typescript
import { CaptchaDetector, CaptchaType } from 'multi-captcha-solver-adapter';

const detector = new CaptchaDetector();

// Detect captcha on a webpage
const captchaType = await detector.detect('https://example.com/login');

switch (captchaType) {
  case CaptchaType.RECAPTCHA_V2:
    console.log('Found reCAPTCHA v2 - use solveRecaptchaV2()');
    break;
  case CaptchaType.RECAPTCHA_V3:
    console.log('Found reCAPTCHA v3 - use solveRecaptchaV3()');
    break;
  case CaptchaType.HCAPTCHA:
    console.log('Found hCaptcha - use solveHCaptcha()');
    break;
  case null:
    console.log('No captcha detected');
    break;
}
```

### Detection with Proxy

```typescript
const detector = new CaptchaDetector({
  timeout: 15000, // 15 second timeout
  userAgent: 'Custom User Agent',
});

const proxy = {
  type: 'http' as const,
  uri: '127.0.0.1:8080',
  username: 'proxy_user',
  password: 'proxy_pass',
};

const captchaType = await detector.detect('https://example.com', proxy);
```

### Advanced Usage with Automatic Solving

```typescript
async function autoSolveCaptcha(url: string, siteKey?: string) {
  const detector = new CaptchaDetector();
  const solver = new MultiCaptchaSolver({
    apiKey: 'YOUR_API_KEY',
    captchaService: ECaptchaSolverService.CapMonster,
  });

  // Detect what type of captcha is present
  const captchaType = await detector.detect(url);

  if (!captchaType) {
    console.log('No captcha found on page');
    return null;
  }

  // Solve based on detected type
  switch (captchaType) {
    case CaptchaType.RECAPTCHA_V2:
      if (!siteKey) throw new Error('Site key required for reCAPTCHA v2');
      return await solver.solveRecaptchaV2(url, siteKey);
      
    case CaptchaType.RECAPTCHA_V3:
      if (!siteKey) throw new Error('Site key required for reCAPTCHA v3');
      return await solver.solveRecaptchaV3(url, siteKey, 0.7, 'submit');
      
    case CaptchaType.HCAPTCHA:
      if (!siteKey) throw new Error('Site key required for hCaptcha');
      return await solver.solveHCaptcha(url, siteKey);
      
    default:
      throw new Error(`Unsupported captcha type: ${captchaType}`);
  }
}

// Usage
const token = await autoSolveCaptcha(
  'https://example.com/login',
  '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
);
```

### Supported Detection Patterns

The `CaptchaDetector` can identify captchas using various patterns:

**reCAPTCHA v2:**

- Google reCAPTCHA scripts (`google.com/recaptcha`)
- `g-recaptcha` CSS classes
- `grecaptcha.render()` function calls
- reCAPTCHA iframes

**reCAPTCHA v3:**

- `grecaptcha.execute()` function calls
- `action` parameters in scripts
- `render=` parameter in script URLs

**hCaptcha:**

- hCaptcha scripts (`hcaptcha.com`, `js.hcaptcha.com`)
- `h-captcha` CSS classes
- `hcaptcha.render()` function calls
- hCaptcha iframes

The detector is designed to work with modern web applications including Single Page Applications (SPAs) built with React, Vue, Angular, Svelte, and other frameworks.

## 🛡️ Error Handling & Retry Behavior

The library provides specific error types for better error handling and implements intelligent retry logic based on error types:

```typescript
import {
  MultiCaptchaError, // Base error class
  CaptchaServiceError, // General API errors (won't retry)
  InvalidApiKeyError, // Invalid API key (won't retry)
  InsufficientBalanceError, // Not enough balance (won't retry)
  IpBlockedError, // IP address blocked (won't retry)
} from 'multi-captcha-solver-adapter';

try {
  const token = await solver.solveRecaptchaV2(
    'https://example.com',
    'site-key',
  );
} catch (error) {
  if (error instanceof InvalidApiKeyError) {
    console.error(
      `❌ Invalid API key for ${error.service} - No retries attempted`,
    );
  } else if (error instanceof InsufficientBalanceError) {
    console.error(
      `💰 Insufficient balance in ${error.service} - No retries attempted`,
    );
  } else if (error instanceof IpBlockedError) {
    console.error(`🚫 IP blocked by ${error.service} - No retries attempted`);
  } else if (error instanceof CaptchaServiceError) {
    console.error(
      `🔧 API error in ${error.service}: ${error.message} - No retries attempted`,
    );
  } else if (error instanceof MultiCaptchaError) {
    console.error(`📚 Library error: ${error.message}`);
  } else {
    console.error(
      `🔄 Network/Generic error: ${error.message} - May have been retried`,
    );
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
- `ECaptchaSolverService.CapMonster` - CapMonster Cloud service

## 📚 Examples

Check out the [examples](./examples/) directory for complete working examples:

- **[Basic Example](./examples/example.ts)** - Basic usage for all captcha types
- **[Proxy Example](./examples/proxy-example.ts)** - Advanced usage with proxy configuration

## 🧪 Testing

This library includes comprehensive test suites to ensure reliability and quality:

### Unit Tests

Run the standard unit tests with mocked dependencies:

```bash
npm test
```

### Integration Tests

Run integration tests with real API calls to captcha services:

```bash
npm run test:integration
```

**Note:** Integration tests require valid API keys set as environment variables:

```bash
export TWOCAPTCHA_API_KEY=your_2captcha_api_key
export ANTICAPTCHA_API_KEY=your_anticaptcha_api_key
export CAPMONSTER_API_KEY=your_capmonster_api_key
```

Integration tests will automatically skip services for which API keys are not provided, allowing you to test only the services you have access to.

### End-to-End (E2E) Tests

Run comprehensive E2E tests that validate the complete flow from captcha detection to resolution:

```bash
# Run E2E tests with API keys
ANTICAPTCHA_API_KEY=your_key npm run test:integration src/__tests__/e2e.integration.spec.ts
```

E2E tests include:

- **Captcha Detection**: Validates automatic captcha type detection using `CaptchaDetector`
- **Service Integration**: Tests real API communication with captcha solving services
- **Complete Flow**: End-to-end validation from detection to token resolution
- **Multi-Service Support**: Tests compatibility across all supported services

**Demo Page Used**: [hCaptcha Demo](https://accounts.hcaptcha.com/demo) with site key `4c672d35-0701-42b2-88c3-78380b0db560`

### Test Coverage

View test coverage reports:

```bash
npm test
# Coverage report will be generated in ./coverage/lcov-report/index.html
```

## 💖 Contributing

Contributions are the heart of the open-source community! We are delighted to accept your help. Please check out our **[Contribution Guide](./CONTRIBUTING.md)** to get started.

## 📄 License

This project is licensed under the Apache-2.0 License. See the [LICENSE](./LICENSE) file for details.

---

### Author

#### Neyib Alexander Daza Guerrero

- **Email**: [dev.alexander.daza@gmail.com](mailto:dev.alexander.daza@gmail.com)
- **GitHub**: [@devalexanderdaza](https://github.com/devalexanderdaza)
