import { ECaptchaSolverService } from './mcs.enum.js';
import { AntiCaptchaService } from './services/anticaptcha.service.js';
import { TwoCaptchaService } from './services/twocaptcha.service.js';
const solverServiceMap = {
    [ECaptchaSolverService.AntiCaptcha]: AntiCaptchaService,
    [ECaptchaSolverService.TwoCaptcha]: TwoCaptchaService,
};
export class MultiCaptchaSolver {
    captchaSolver;
    constructor(options) {
        if (!options || !options.apiKey || !options.captchaService) {
            throw new Error('No valid options provided.');
        }
        const SolverService = solverServiceMap[options.captchaService];
        if (SolverService) {
            this.captchaSolver = new SolverService(options.apiKey);
        }
        else {
            throw new Error('Invalid or unsupported captcha service.');
        }
    }
    async getBalance() {
        return this.captchaSolver.getBalance();
    }
    async solveImageCaptcha(base64string) {
        return this.captchaSolver.solveImageCaptcha(base64string);
    }
}
//# sourceMappingURL=main.js.map