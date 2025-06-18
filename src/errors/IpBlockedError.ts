// src/errors/IpBlockedError.ts
import { CaptchaServiceError } from './CaptchaServiceError.js';

export class IpBlockedError extends CaptchaServiceError {
    constructor(service: string) {
        super(`IP blocked by ${service}.`, service);
        this.name = 'IpBlockedError';
        Object.setPrototypeOf(this, IpBlockedError.prototype);
    }
}
