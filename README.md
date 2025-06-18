# Multi Captcha Solver

## Project Description

`multi-captcha-solver` is a Node.js library designed to simplify the process of integrating various captcha solving services into your projects. It provides a unified interface to interact with different providers like 2Captcha and AntiCaptcha, allowing you to easily switch between services or use them concurrently. The primary goal is to offer a consistent API for common operations such as retrieving account balance and solving image captchas.

## Installation

You can install `multi-captcha-solver` using npm or yarn:

**Using npm:**
```bash
npm install multi-captcha-solver
```

**Using yarn:**
```bash
yarn add multi-captcha-solver
```

## Usage

### Importing and Initializing `MultiCaptchaSolver`

First, you need to import the `MultiCaptchaSolver` class and the `ECaptchaSolverService` enum. Then, create an instance of `MultiCaptchaSolver` with your API key and the desired service.

```typescript
import { MultiCaptchaSolver, ECaptchaSolverService } from 'multi-captcha-solver';

// For 2Captcha
const twoCaptchaSolver = new MultiCaptchaSolver({
  apiKey: 'YOUR_2CAPTCHA_API_KEY',
  captchaService: ECaptchaSolverService.TwoCaptcha,
});

// For AntiCaptcha
const antiCaptchaSolver = new MultiCaptchaSolver({
  apiKey: 'YOUR_ANTICAPTCHA_API_KEY',
  captchaService: ECaptchaSolverService.AntiCaptcha,
});
```

### Getting Account Balance

You can retrieve the current balance of your captcha service account.

```typescript
async function checkBalance(solver: MultiCaptchaSolver) {
  try {
    const balance = await solver.getBalance();
    console.log(`Account Balance: $${balance}`);
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}

// Example with 2Captcha
checkBalance(twoCaptchaSolver);

// Example with AntiCaptcha
checkBalance(antiCaptchaSolver);
```

### Solving an Image Captcha

To solve an image captcha, provide a base64 encoded string of the image.

```typescript
async function solveCaptcha(solver: MultiCaptchaSolver, base64Image: string) {
  try {
    const solution = await solver.solveImageCaptcha(base64Image);
    console.log(`Captcha Solution: ${solution}`);
  } catch (error) {
    console.error('Error solving captcha:', error);
  }
}

// Example with a placeholder base64 image string
const sampleBase64Image = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Replace with your actual base64 image

// Example with 2Captcha
solveCaptcha(twoCaptchaSolver, sampleBase64Image);

// Example with AntiCaptcha
solveCaptcha(antiCaptchaSolver, sampleBase64Image);
```

## Code Examples

Below are complete examples demonstrating how to use the library with different services.

**Example using 2Captcha:**

```typescript
import { MultiCaptchaSolver, ECaptchaSolverService } from 'multi-captcha-solver';

async function main() {
  const solver = new MultiCaptchaSolver({
    apiKey: 'YOUR_2CAPTCHA_API_KEY', // Replace with your actual API key
    captchaService: ECaptchaSolverService.TwoCaptcha,
  });

  try {
    // Get balance
    const balance = await solver.getBalance();
    console.log(`2Captcha Balance: $${balance}`);

    // Solve an image captcha (replace with a real base64 image string)
    const base64Image = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const solution = await solver.solveImageCaptcha(base64Image);
    console.log(`Captcha solved by 2Captcha. Solution: ${solution}`);
  } catch (error) {
    console.error('An error occurred with 2Captcha service:', error);
  }
}

main();
```

**Example using AntiCaptcha:**

```typescript
import { MultiCaptchaSolver, ECaptchaSolverService } from 'multi-captcha-solver';

async function main() {
  const solver = new MultiCaptchaSolver({
    apiKey: 'YOUR_ANTICAPTCHA_API_KEY', // Replace with your actual API key
    captchaService: ECaptchaSolverService.AntiCaptcha,
  });

  try {
    // Get balance
    const balance = await solver.getBalance();
    console.log(`AntiCaptcha Balance: $${balance}`);

    // Solve an image captcha (replace with a real base64 image string)
    const base64Image = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const solution = await solver.solveImageCaptcha(base64Image);
    console.log(`Captcha solved by AntiCaptcha. Solution: ${solution}`);
  } catch (error) {
    console.error('An error occurred with AntiCaptcha service:', error);
  }
}

main();
```
This `README.md` provides a comprehensive guide for users to get started with the `multi-captcha-solver` library. Remember to replace placeholder API keys and base64 image strings with actual values when using the examples.
