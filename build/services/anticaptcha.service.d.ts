import { IMultiCaptchaSolver } from "../mcs.interface.js";
export declare class AntiCaptchaService implements IMultiCaptchaSolver {
    private client;
    constructor(apiKey: string);
    getBalance(): Promise<number>;
    solveImageCaptcha(base64string: string): Promise<string>;
}
