/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

/**
 * Executes a function with automatic retries and exponential backoff.
 *
 * @template T The return type of the function
 * @param {() => Promise<T>} fn - The async function to execute with retries
 * @param {number} retries - The maximum number of retry attempts
 * @param {number} delayMs - The initial delay in milliseconds before the first retry
 * @returns {Promise<T>} A promise that resolves with the function result
 * @throws {Error} The last error encountered if all retries fail
 *
 * @example
 * ```typescript
 * const result = await withRetries(
 *   () => apiCall(),
 *   3,    // max 3 retries
 *   500   // start with 500ms delay
 * );
 * ```
 */
export async function withRetries<T>(
  fn: () => Promise<T>,
  retries: number,
  delayMs: number,
): Promise<T> {
  let lastError: Error | undefined;

  // Handle the case where retries is 0 - never call the function
  if (retries <= 0) {
    throw new Error('Cannot execute function with 0 or negative retries');
  }

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        // Exponential backoff: delay doubles with each retry
        const delay = delayMs * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // If we get here, all retries have failed
  throw lastError;
}
