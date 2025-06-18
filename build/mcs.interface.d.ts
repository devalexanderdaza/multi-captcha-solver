import { ECaptchaSolverService } from './mcs.enum.js';
export interface IMultiCaptchaSolver {
    getBalance(): Promise<number>;
    solveImageCaptcha(base64string: string): Promise<string>;
}
export interface IMultiCaptchaSolverOptions {
    apiKey: string;
    captchaService: ECaptchaSolverService;
}
