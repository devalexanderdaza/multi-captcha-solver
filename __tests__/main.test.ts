import { MultiCaptchaSolver } from "../src/main.js";
import { ECaptchaSolverService } from "../src/mcs.enum.js";
import { IMultiCaptchaSolverOptions } from "../src/mcs.interface.js";

// Mock para AntiCaptchaService
jest.mock('./services/anticaptcha.service', () => {
  return {
    AntiCaptchaService: jest.fn().mockImplementation(() => ({
      getBalance: jest.fn().mockResolvedValue(100),  // Puedes cambiar este valor según tus necesidades
      solveImageCaptcha: jest.fn().mockResolvedValue('52848783'),
    })),
  };
});

describe('MultiCaptchaSolver', () => {
  const validOptions: IMultiCaptchaSolverOptions = {
    apiKey: 'your-api-key',
    captchaService: ECaptchaSolverService.AntiCaptcha,
  };

  // Prueba constructor con opciones válidas
  it('should create an instance with valid options', () => {
    const multiCaptchaSolver = new MultiCaptchaSolver(validOptions);
    expect(multiCaptchaSolver).toBeInstanceOf(MultiCaptchaSolver);
  });

  // Prueba constructor sin opciones
  it('should throw an error if no options provided', () => {
    expect(() => new MultiCaptchaSolver(null)).toThrowError('No valid options provided.');
  });

  // Prueba getBalance
  it('should get the balance of the captcha solver account', async () => {
    const multiCaptchaSolver = new MultiCaptchaSolver(validOptions);
    const balance = await multiCaptchaSolver.getBalance();
    expect(balance).toEqual(expect.any(Number));
  });

  // Prueba solveImageCaptcha
  it('should solve an image captcha', async () => {
    const multiCaptchaSolver = new MultiCaptchaSolver(validOptions);
    const captchaSolution = await multiCaptchaSolver.solveImageCaptcha('base64string');
    expect(captchaSolution).toEqual('52848783');
  });

  // Prueba constructor con servicio de captcha no válido
  it('should throw an error if an invalid captcha service is provided', () => {
    const invalidOptions: IMultiCaptchaSolverOptions = {
      apiKey: 'your-api-key',
      captchaService: 'InvalidService' as ECaptchaSolverService,
    };
    expect(() => new MultiCaptchaSolver(invalidOptions)).toThrowError('Invalid captcha service.');
  });
});
