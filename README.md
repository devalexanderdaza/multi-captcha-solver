# ✨ Multi-Captcha Solver Adapter ✨

[![NPM Version](https://img.shields.io/npm/v/multi-captcha-solver-adapter?style=for-the-badge)](https://www.npmjs.com/package/multi-captcha-solver-adapter)
[![Build Status](https://img.shields.io/github/actions/workflow/status/devalexanderdaza/multi-captcha-solver/build.yml?branch=main&style=for-the-badge)](https://github.com/devalexanderdaza/multi-captcha-solver/actions/workflows/build.yml)
[![NPM Downloads](https://img.shields.io/npm/dt/multi-captcha-solver-adapter?style=for-the-badge)](https://www.npmjs.com/package/multi-captcha-solver-adapter)
[![License](https://img.shields.io/github/license/devalexanderdaza/multi-captcha-solver?style=for-the-badge)](./LICENSE)
[![Contributors](https://img.shields.io/github/contributors/devalexanderdaza/multi-captcha-solver?style=for-the-badge)](https://github.com/devalexanderdaza/multi-captcha-solver/graphs/contributors)

A powerful and easy-to-use NodeJS library that unifies multiple captcha-solving services under a single, elegant interface. Stop implementing a new API for every provider!

---

## 🚀 Key Features

* **🧩 Multi-Provider Support**: Built-in support for the most popular captcha services.
* **🛡️ Unified Interface**: Use the same code to talk to different services. Switch providers by changing just one line!
* **💯 Strictly Typed**: Developed 100% in TypeScript for more robust and predictable code.
* **🌐 Modern Stack**: Built with ES Modules, the latest standard for JavaScript modules.
* **🤝 Extensible by Design**: Engineered to make adding new providers incredibly simple.

## 🛠️ Supported Services

* [x] 2Captcha
* [x] Anti-Captcha
* _... and more coming soon! (Want to add one? See how to contribute!)_

## 📦 Installation

```bash
npm install multi-captcha-solver-adapter
```

## 👨‍💻 Basic Usage

Here's a quick example of how to solve an image captcha, including the new robust error handling:

```typescript
import { MultiCaptchaSolver, ECaptchaSolverService } from 'multi-captcha-solver-adapter';
// Import custom errors to handle specific cases
import { CaptchaServiceError, IpBlockedError } from 'multi-captcha-solver-adapter/errors';

// Your base64-encoded captcha image
const imageBase64 = '...';

const solve = async () => {
  try {
    const solver = new MultiCaptchaSolver({
      apiKey: 'YOUR_PROVIDER_API_KEY',
      captchaService: ECaptchaSolverService.AntiCaptcha // Or .TwoCaptcha
    });

    // 1. (Optional) Check your balance
    const balance = await solver.getBalance();
    console.log(`Your current balance is: $${balance}`);

    // 2. Solve the captcha
    const solution = await solver.solveImageCaptcha(imageBase64);
    console.log(`🎉 The solution is: ${solution}!`);

  } catch (error) {
    // Now you can handle specific errors!
    if (error instanceof IpBlockedError) {
      console.error(`IP has been blocked by ${error.service}. Please check your proxy or wait.`);
    } else if (error instanceof CaptchaServiceError) {
      console.error(`An API error occurred with ${error.service}:`, error.message);
    } else {
      console.error('😱 An unexpected error occurred:', error);
    }
  }
};

solve();
```

## 💖 Contributing

Contributions are the heart of the open-source community\! We are delighted to accept your help. Please check out our **[Contribution Guide](./CONTRIBUTING.md)** to get started.

## 📄 License

This project is licensed under the Apache-2.0 License. See the [LICENSE](./LICENSE) file for details.

-----

### Author

**Neyib Alexander Daza Guerrero**

  * **Email**: [dev.alexander.daza@gmail.com](mailto:dev.alexander.daza@gmail.com)
  * **GitHub**: [@devalexanderdaza](https://github.com/devalexanderdaza)

<!-- end list -->
