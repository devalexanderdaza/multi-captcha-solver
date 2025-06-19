/**
 * Author: Neyib Alexander Daza Guerrero
 * Email: dev.alexander.daza@gmail.com
 * Github: https://github.com/devalexanderdaza
 */

import { withRetries } from '../utils/retry.helper.js';

describe('withRetries', () => {
  it('should return the result immediately if the function succeeds on first try', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');

    const result = await withRetries(mockFn, 3, 50);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry the specified number of times before giving up', async () => {
    const mockError = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(mockError);

    await expect(withRetries(mockFn, 3, 50)).rejects.toThrow('Test error');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should succeed on a retry after initial failures', async () => {
    const mockError = new Error('Temporary error');
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(mockError)
      .mockRejectedValueOnce(mockError)
      .mockResolvedValue('success on third try');

    const result = await withRetries(mockFn, 3, 50);

    expect(result).toBe('success on third try');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should implement exponential backoff delays', async () => {
    const mockError = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    await expect(withRetries(mockFn, 3, 100)).rejects.toThrow('Test error');

    // Check that setTimeout was called with exponential backoff delays
    // First retry: 100ms * 2^0 = 100ms
    // Second retry: 100ms * 2^1 = 200ms
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 200);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(2); // Only 2 delays for 3 attempts

    setTimeoutSpy.mockRestore();
  });

  it('should not delay before the first attempt', async () => {
    const mockFn = jest.fn().mockResolvedValue('immediate success');
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    const result = await withRetries(mockFn, 3, 500);

    expect(result).toBe('immediate success');
    expect(setTimeoutSpy).not.toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);

    setTimeoutSpy.mockRestore();
  });

  it('should handle zero retries correctly', async () => {
    const mockError = new Error('Immediate failure');
    const mockFn = jest.fn().mockRejectedValue(mockError);

    await expect(withRetries(mockFn, 0, 500)).rejects.toThrow(
      'Cannot execute function with 0 or negative retries',
    );
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it('should handle single retry correctly', async () => {
    const mockError = new Error('Single retry failure');
    const mockFn = jest.fn().mockRejectedValue(mockError);

    await expect(withRetries(mockFn, 1, 50)).rejects.toThrow(
      'Single retry failure',
    );
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should preserve the original error type and message', async () => {
    class CustomError extends Error {
      constructor(
        message: string,
        public code: number,
      ) {
        super(message);
        this.name = 'CustomError';
      }
    }

    const customError = new CustomError('Custom error message', 404);
    const mockFn = jest.fn().mockRejectedValue(customError);

    await expect(withRetries(mockFn, 2, 50)).rejects.toThrow(CustomError);
    await expect(withRetries(mockFn, 2, 50)).rejects.toThrow(
      'Custom error message',
    );

    let thrownError: CustomError | undefined;
    try {
      await withRetries(mockFn, 2, 50);
    } catch (error) {
      thrownError = error as CustomError;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError?.code).toBe(404);
  });

  it('should work with different return types', async () => {
    // Test with number
    const numberFn = jest.fn().mockResolvedValue(42);
    const numberResult = await withRetries(numberFn, 3, 50);
    expect(numberResult).toBe(42);

    // Test with object
    const objectFn = jest.fn().mockResolvedValue({ key: 'value' });
    const objectResult = await withRetries(objectFn, 3, 50);
    expect(objectResult).toEqual({ key: 'value' });

    // Test with array
    const arrayFn = jest.fn().mockResolvedValue([1, 2, 3]);
    const arrayResult = await withRetries(arrayFn, 3, 50);
    expect(arrayResult).toEqual([1, 2, 3]);
  });
});
