import { ECaptchaSolverService } from "./mcs.enum.js";
import { AntiCaptchaService } from "./services/anticaptcha.service.js";
import { TwoCaptchaService } from "./services/twocaptcha.service.js";
export class MultiCaptchaSolver {
    captchaSolver;
    constructor(options) {
        if (!options || !options.apiKey || !options.captchaService) {
            throw new Error("No valid options provided.");
        }
        if (options.captchaService === ECaptchaSolverService.AntiCaptcha) {
            this.captchaSolver = new AntiCaptchaService(options.apiKey);
        }
        else if (options.captchaService === ECaptchaSolverService.TwoCaptcha) {
            this.captchaSolver = new TwoCaptchaService(options.apiKey);
        }
        else {
            throw new Error("Invalid captcha service.");
        }
    }
    async getBalance() {
        return await this.captchaSolver.getBalance();
    }
    async solveImageCaptcha(base64string) {
        return this.captchaSolver.solveImageCaptcha(base64string);
    }
}
//# sourceMappingURL=main.js.map