import { IMultiCaptchaSolver } from "../mcs.interface.js";
export declare class TwoCaptchaService implements IMultiCaptchaSolver {
    private client;
    constructor(apiKey: string);
    getBalance(): Promise<number>;
    solveImageCaptcha(base64string: string): Promise<string>;
}
