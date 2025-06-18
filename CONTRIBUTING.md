# Contributing to Multi-Captcha Solver Adapter

First off, thank you for considering contributing to Multi-Captcha Solver Adapter! It's people like you that make open source such a great community. We welcome any type of contribution, not only code.

## Project Philosophy

Multi-Captcha Solver Adapter aims to provide a unified, simple, and robust interface for interacting with various captcha solving services. We want to make it easy for developers to integrate captcha solving into their applications without worrying about the specifics of each provider's API. Our goal is to support a wide range of services through an extensible and maintainable codebase.

## Getting Started

### Setting up the Development Environment

1.  **Fork the repository:** Start by forking the [main repository](https://github.com/devalexanderdaza/multi-captcha-solver) to your GitHub account.
2.  **Clone your fork:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/multi-captcha-solver.git
    cd multi-captcha-solver
    ```
3.  **Install dependencies:** This project uses Yarn for package management. If you don't have Yarn, please install it first.
    ```bash
    npm install
    ```
    *(Note: The project uses `yarn.lock`, so `yarn install` is preferred if you have Yarn installed. However, `npm install` should also work based on `package.json`)*

### Running Tests

To ensure everything is working correctly and that your changes haven't broken anything, run the test suite:

```bash
npm run test
```

This will execute all unit tests using Jest and display a coverage report. Please ensure all tests pass before submitting a pull request.

## Pull Request Workflow

1.  **Create a new branch:** Before making any changes, create a new branch from `main`:
    ```bash
    git checkout -b feature/your-awesome-feature
    ```
    Or for bug fixes:
    ```bash
    git checkout -b fix/issue-number-description
    ```
2.  **Make your changes:** Implement your feature or fix the bug. Ensure your code adheres to the project's coding style (ESLint and Prettier are used).
3.  **Commit your changes:** Write clear, concise commit messages.
    ```bash
    git commit -m "feat: Add support for NewCaptchaService"
    ```
4.  **Push to your fork:**
    ```bash
    git push origin feature/your-awesome-feature
    ```
5.  **Open a Pull Request:** Go to the original repository on GitHub and open a pull request from your forked branch to the `main` branch of the `devalexanderdaza/multi-captcha-solver` repository.
    *   Fill out the pull request template with details about your changes.
    *   Ensure all automated checks (like GitHub Actions for build and tests) are passing.

## How to Add a New Captcha Provider (The Right Way)

We've designed the system to be easily extensible for new captcha providers. The old `if/else` logic has been replaced with a more scalable factory map pattern. Here’s how to add a new one:

1.  **Create Your Service Class:**
    *   Navigate to the `src/services/` directory.
    *   Create a new TypeScript file for your service, e.g., `NewCaptchaService.ts`.
    *   Your class **must** implement the `IMultiCaptchaSolver` interface, which is defined in `src/mcs.interface.ts`. This typically means implementing `getBalance()` and `solveImageCaptcha(base64string: string)` methods.

    ```typescript
    // src/services/NewCaptchaService.ts
    import { IMultiCaptchaSolver } from '../mcs.interface';
    // You might need to import specific error types if your service throws custom errors
    // import { CaptchaServiceError, NetworkError, ... } from '../errors'; // Adjust path as needed

    export class NewCaptchaService implements IMultiCaptchaSolver {
      private apiKey: string;

      constructor(apiKey: string) {
        this.apiKey = apiKey;
        // Initialize your service-specific HTTP client or SDK here
      }

      async getBalance(): Promise<number> {
        // Implement logic to fetch balance from the new provider's API
        // Example:
        // const response = await this.httpClient.post('url_to_balance_api', { key: this.apiKey });
        // return response.data.balance;
        throw new Error('getBalance not implemented for NewCaptchaService'); // Replace with actual implementation
      }

      async solveImageCaptcha(base64string: string): Promise<string> {
        // Implement logic to submit image and get solution from the new provider's API
        // Example:
        // const response = await this.httpClient.post('url_to_solve_api', { key: this.apiKey, body: base64string, method: 'base64' });
        // const taskId = response.data.taskId;
        // ...polling logic...
        // return solutionText;
        throw new Error('solveImageCaptcha not implemented for NewCaptchaService'); // Replace with actual implementation
      }
    }
    ```

2.  **Add to Enum:**
    *   Open `src/mcs.enum.ts`.
    *   Add your new service to the `ECaptchaSolverService` enum. Choose a simple, descriptive key.

    ```typescript
    // src/mcs.enum.ts
    export enum ECaptchaSolverService {
      TwoCaptcha = "2captcha",
      AntiCaptcha = "anticaptcha",
      NewCaptchaService = "newcaptchaservice", // Add your service here
      // ... other services
    }
    ```

3.  **Register in Factory Map:**
    *   Open `src/main.ts`.
    *   Import your new service class at the top of the file:
        ```typescript
        // src/main.ts
        import { NewCaptchaService } from "./services/NewCaptchaService.js"; // Ensure .js extension for ES Modules
        ```
    *   Add your service to the `solverServiceMap` object, mapping the enum value to your service class:
        ```typescript
        // src/main.ts
        const solverServiceMap: { [key in ECaptchaSolverService]?: new (apiKey: string) => IMultiCaptchaSolver } = {
          [ECaptchaSolverService.AntiCaptcha]: AntiCaptchaService,
          [ECaptchaSolverService.TwoCaptcha]: TwoCaptchaService,
          [ECaptchaSolverService.NewCaptchaService]: NewCaptchaService, // Register your service here
        };
        ```
        *(Note: The `.js` extension in imports is important if your `tsconfig.json` `module` resolution strategy requires it for ES Modules output, which is common.)*

4.  **Add Unit Tests:**
    *   Create a new test file for your service in the `src/__tests__/` directory (e.g., `NewCaptchaService.spec.ts`).
    *   Write comprehensive unit tests for your service, mocking API calls and testing both successful responses and error conditions. Refer to existing tests like `anticaptcha.service.spec.ts` or `twocaptcha.service.spec.ts` for examples.

5.  **Update Documentation:**
    *   Open `README.md`.
    *   Add your new service to the "🛠️ Supported Services" section.
    *   If your service has unique setup steps or considerations, briefly mention them or link to more detailed documentation.

Thank you for contributing!
