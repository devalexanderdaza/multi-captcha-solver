import { AntiCaptcha, AntiCaptchaError, ErrorCodes, TaskTypes } from "anticaptcha";
export class AntiCaptchaService {
    client;
    constructor(apiKey) {
        this.client = new AntiCaptcha(apiKey);
    }
    async getBalance() {
        try {
            const balance = await this.client.getBalance();
            return balance;
        }
        catch (error) {
            if (error instanceof AntiCaptchaError &&
                error.code === ErrorCodes.ERROR_IP_BLOCKED) {
                throw new Error("IP blocked by AntiCaptcha.");
            }
            else {
                throw new Error("Error getting balance from AntiCaptcha.");
            }
        }
    }
    async solveImageCaptcha(base64string) {
        try {
            const taskId = await this.client.createTask({
                type: TaskTypes.IMAGE_TO_TEXT,
                body: base64string,
            });
            const response = await this.client.getTaskResult(taskId);
            return response.solution.text;
        }
        catch (error) {
            if (error instanceof AntiCaptchaError &&
                error.code === ErrorCodes.ERROR_IP_BLOCKED) {
                throw new Error("IP blocked by AntiCaptcha.");
            }
            else {
                throw new Error("Error solving captcha by AntiCaptcha.");
            }
        }
    }
}
//# sourceMappingURL=anticaptcha.service.js.map