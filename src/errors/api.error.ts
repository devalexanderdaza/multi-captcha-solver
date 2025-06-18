import { MultiCaptchaError } from './base.error.js';

// For errors returned by the provider's API
export class CaptchaServiceError extends MultiCaptchaError {
  constructor(
    public readonly service: string,
    message: string,
  ) {
    super(`[${service}] ${message}`);
    this.name = 'CaptchaServiceError';
  }
}

// Specific API errors
export class InsufficientBalanceError extends CaptchaServiceError {}
export class InvalidApiKeyError extends CaptchaServiceError {}
export class IpBlockedError extends CaptchaServiceError {}
