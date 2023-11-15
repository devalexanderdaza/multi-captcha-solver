import { IMultiCaptchaSolverOptions } from "./mcs.interface.js";
export declare class MultiCaptchaSolver {
    private captchaSolver;
    constructor(options: IMultiCaptchaSolverOptions);
    getBalance(): Promise<number>;
    solveImageCaptcha(base64string: string): Promise<string>;
}
