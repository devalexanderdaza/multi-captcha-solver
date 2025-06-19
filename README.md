# ✨ Multi-Captcha Solver Adapter ✨

[![NPM Version](https://img.shields.io/npm/v/multi-captcha-solver-adapter?style=for-the-badge)](https://www.npmjs.com/package/multi-captcha-solver-adapter)
[![Build Status](https://img.shields.io/github/actions/workflow/status/devalexanderdaza/multi-captcha-solver/build.yml?branch=main&style=for-the-badge)](https://github.com/devalexanderdaza/multi-captcha-solver/actions/workflows/build.yml)
[![NPM Downloads](https://img.shields.io/npm/dt/multi-captcha-solver-adapter?style=for-the-badge)](https://www.npmjs.com/package/multi-captcha-solver-adapter)
[![License](https://img.shields.io/github/license/devalexanderdaza/multi-captcha-solver?style=for-the-badge)](./LICENSE)
[![Contributors](https://img.shields.io/github/contributors/devalexanderdaza/multi-captcha-solver?style=for-the-badge)](https://github.com/devalexanderdaza/multi-captcha-solver/graphs/contributors)

A powerful and easy-to-use NodeJS library that unifies multiple captcha-solving services under a single, elegant interface. Stop implementing a new API for every provider!

---

## 🚀 Key Features

- **🧩 Multi-Provider Support**: Built-in support for the most popular captcha services.
- **🛡️ Unified Interface**: Use the same code to talk to different services. Switch providers by changing just one line!
- **💯 Strictly Typed**: Developed 100% in TypeScript for more robust and predictable code.
- **🌐 Modern Stack**: Built with ES Modules, the latest standard for JavaScript modules.
- **🤝 Extensible by Design**: Engineered to make adding new providers incredibly simple.

## 🛠️ Supported Services

- [x] 2Captcha
- [x] Anti-Captcha
- _... and more coming soon! (Want to add one? See how to contribute!)_

## 📦 Installation

```bash
npm install multi-captcha-solver-adapter
```

## 👨‍💻 Usage Example

Here's a quick example of how to solve a reCAPTCHA v2, including the new robust error handling:

```typescript
import {
  MultiCaptchaSolver,
  ECaptchaSolverService,
  // Import custom errors to handle specific cases!
  InvalidApiKeyError,
  CaptchaServiceError,
} from 'multi-captcha-solver-adapter';

const solve = async () => {
  try {
    const solver = new MultiCaptchaSolver({
      apiKey: 'YOUR_PROVIDER_API_KEY',
      captchaService: ECaptchaSolverService.TwoCaptcha,
    });

    // 1. (Optional) Check your balance
    const balance = await solver.getBalance();
    console.log(`Your current balance is: $${balance}`);

    // 2. Solve the reCAPTCHA
    const recaptchaToken = await solver.solveRecaptchaV2(
      'https://example.com', 
      'your-google-site-key'
    );
    console.log(`🎉 The reCAPTCHA token is: ${recaptchaToken}!`);

  } catch (error) {
    // Now you can handle specific errors!
    if (error instanceof InvalidApiKeyError) {
      console.error(
        `API Key is invalid for ${error.service}. Please check it and try again.`
      );
    } else if (error instanceof CaptchaServiceError) {
      console.error(
        `An API error occurred with ${error.service}:`,
        error.message
      );
    } else {
      console.error('😱 An unexpected error occurred:', error);
    }
  }
};

solve();
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
const recaptchaToken = await solver.solveRecaptchaV2(
  'https://example.com',  // Website URL
  'site-key-here'         // Google site key
);
```

## 🛡️ Error Handling

The library provides specific error types for better error handling:

```typescript
import {
  MultiCaptchaError,      // Base error class
  CaptchaServiceError,    // General API errors
  InvalidApiKeyError,     // Invalid API key
  InsufficientBalanceError, // Not enough balance
  IpBlockedError,         // IP address blocked
} from 'multi-captcha-solver-adapter';

try {
  // Your captcha solving code
} catch (error) {
  if (error instanceof InvalidApiKeyError) {
    // Handle invalid API key
    console.error(`Invalid API key for ${error.service}`);
  } else if (error instanceof InsufficientBalanceError) {
    // Handle insufficient balance
    console.error(`Insufficient balance in ${error.service}`);
  } else if (error instanceof IpBlockedError) {
    // Handle blocked IP
    console.error(`IP blocked by ${error.service}`);
  } else if (error instanceof CaptchaServiceError) {
    // Handle other API errors
    console.error(`API error in ${error.service}: ${error.message}`);
  } else if (error instanceof MultiCaptchaError) {
    // Handle other library errors
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

#### Methods

- `getBalance(): Promise<number>` - Get account balance
- `solveImageCaptcha(base64string: string): Promise<string>` - Solve image captcha
- `solveRecaptchaV2(websiteURL: string, websiteKey: string): Promise<string>` - Solve reCAPTCHA v2

#### Supported Services

- `ECaptchaSolverService.TwoCaptcha` - 2Captcha service
- `ECaptchaSolverService.AntiCaptcha` - Anti-Captcha service

## 💖 Contributing

Contributions are the heart of the open-source community\! We are delighted to accept your help. Please check out our **[Contribution Guide](./CONTRIBUTING.md)** to get started.

## 📄 License

This project is licensed under the Apache-2.0 License. See the [LICENSE](./LICENSE) file for details.

---

### Author

#### Neyib Alexander Daza Guerrero

- **Email**: [dev.alexander.daza@gmail.com](mailto:dev.alexander.daza@gmail.com)
- **GitHub**: [@devalexanderdaza](https://github.com/devalexanderdaza)

<!-- end list -->
