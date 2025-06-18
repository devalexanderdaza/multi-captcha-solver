import { Solver, APIError } from '2captcha';
export class TwoCaptchaService {
    client;
    constructor(apiKey) {
        this.client = new Solver(apiKey);
    }
    async getBalance() {
        try {
            return await this.client.balance();
        }
        catch (error) {
            if (error instanceof APIError) {
                throw new Error(`Error getting balance from 2Captcha. ${error.cause}`);
            }
            else {
                throw new Error(`Error getting balance from 2Captcha.`);
            }
        }
    }
    async solveImageCaptcha(base64string) {
        try {
            const solvedCaptcha = await this.client.imageCaptcha(base64string);
            return solvedCaptcha.data;
        }
        catch (error) {
            if (error instanceof APIError) {
                throw new Error(`Error solving captcha with 2Captcha. ${error.cause}`);
            }
            else {
                throw new Error(`Error solving captcha with 2Captcha.`);
            }
        }
    }
}
//# sourceMappingURL=twocaptcha.service.js.map