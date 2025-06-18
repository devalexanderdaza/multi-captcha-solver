// src/errors/CaptchaServiceError.ts
export class CaptchaServiceError extends Error {
  constructor(message: string, public service: string) {
    super(message);
    this.name = 'CaptchaServiceError';
    Object.setPrototypeOf(this, CaptchaServiceError.prototype);
  }
}
