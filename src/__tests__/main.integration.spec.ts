/**
 * Integration Tests for Multi-Captcha Solver
 *
 * These tests perform real API calls to captcha solving services.
 * They validate the actual communication and functionality with external providers.
 *
 * Environment Variables Required:
 * - TWOCAPTCHA_API_KEY: API key for 2Captcha service
 * - ANTICAPTCHA_API_KEY: API key for Anti-Captcha service
 * - CAPMONSTER_API_KEY: API key for CapMonster service
 *
 * @author Alexander Daza
 */

// Import direct services to avoid CaptchaDetector node-fetch issues
import { AntiCaptchaService } from '../services/anticaptcha.service.js';
import { CapMonsterService } from '../services/capmonster.service.js';
import { TwoCaptchaService } from '../services/twocaptcha.service.js';

// Imagen simple de captcha en base64 para pruebas (4 dígitos)
const SAMPLE_CAPTCHA_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAhCAYAAABduLrHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADcklEQVRoge2ZS0hUURjHf2Om5atMH1aolBGRBSVRiwpql0W0qF20aVsQBLWoTRDRok3QQghBiyAIWgRBG6F6LLKyaFGLIlpUFJWVmVmOr/E1c2+L7517HzN3xnHGOyN+cGDu/773nP/5v+97H7AWUAVcB4aA78AgcB04AKwH/ifmAR3AhAkfA7qB7cBUqyMWyAN6pZBJ6wH2ANuArSzPQrKAA8CjJGo2+oa2P7Qx7cJOIAN4kqIL8z0FbAY2SJyO2A6cBD5K3IuJb2hj2oVGSNWF0fYU9lO65s8ZJaBUFIpiURh4IUZvBCeBNYnq5QKHgY8WeJ/EabFgFJjuGLU+YKgLuAucBXKtoHbpE+CZBf8jGUfEGHZgp5Zf0mxw3aJH4wbQLuIOAi8lhqPAZmAgMahA7vwFYIsYrM3fBuyRWPbinQQ+ivE8/kWU3Vo1KwU0y0Z1iydFAduJz0+gXhqsm6hPLDxm4b2OHR4CeoEPQBiokXZrzK8OfpnFxOwBfGJQgxjfB3wFPkns8zh/faBdChmzSjYtGRE1HGqJ5zDwzSJC74aH3VYG1kSKBGpKrGZX0z0HaHeM5xdjH5ZjBgwlhsUZJKcDpwUgJ2sTzRrLl+Goo7ddBhXJODeB82KMLjE2yfFeAb1ykLWLUfaLs4LLHFoqcCqFf/v0IcvE1qvQI3BZHpKsR6BLuqYq2Sh3bpMYq11OTKfIrBBIJ77iqZMPvqnFYHEqK7oBZ3/hQPOYFDEmhTyxILOyOGYaowjKCCnLzJaYmr11+e0H2ib5u7WKlE8hZuTt/YfJ8o38zt8H7BdQgRxOp0WR3H13+ZAV5GzDfFgPchWpUMa1ZuDbkYKFVGwpRq0V8PgDT9rIeVD5hzGqvWBLPqV2xPQSI5GE7SJr2zbY/sIcjdOyS/LRTCV+AeWy6rRbYNhqQRfJ+ib5TCGx+23gIrDSwmGXcKjHEnsKSi0KnbTA5RGQRWK8t8BFJJ7VUiyKHJKnFUE0jqMCJ2RVzSZJX2rRKGKj7HA6B0wCa+VaAXBOCtHFnpJ9E/BEFmw3r5YPrjuUyiprU7hKdOmsyNplrJKNslG2y37pxdqD9BbLdqD3SLux3iF9j2QGsNwjAzgvhXgNeB6YI8fQzpAf7BX6Tc53AXoAAAAASUVORK5CYII=';

// Helper para verificar si las variables de entorno están disponibles
const getEnvironmentVariables = (): {
  TWOCAPTCHA_API_KEY: string | undefined;
  ANTICAPTCHA_API_KEY: string | undefined;
  CAPMONSTER_API_KEY: string | undefined;
} => {
  return {
    TWOCAPTCHA_API_KEY: process.env.TWOCAPTCHA_API_KEY,
    ANTICAPTCHA_API_KEY: process.env.ANTICAPTCHA_API_KEY,
    CAPMONSTER_API_KEY: process.env.CAPMONSTER_API_KEY,
  };
};

// Helper para mostrar mensaje de omisión claro
const skipMessage = (service: string, envVar: string): string =>
  `⚠️  Skipping ${service} integration tests: ${envVar} environment variable not set.\n` +
  `   To run these tests, set: export ${envVar}=your_api_key`;

describe('Integration Tests - Real API Calls', () => {
  const envVars = getEnvironmentVariables();

  beforeAll(() => {
    console.log('\n🧪 Starting Integration Tests');
    console.log('📋 Environment Variables Status:');

    Object.entries(envVars).forEach(([key, value]) => {
      console.log(`   ${key}: ${value ? '✅ Set' : '❌ Not Set'}`);
    });

    console.log(
      '\n⚠️  Note: Tests will be skipped for services without API keys\n',
    );
  });

  describe('2Captcha Service Integration', () => {
    let solver: TwoCaptchaService;

    beforeEach(() => {
      if (!envVars.TWOCAPTCHA_API_KEY) {
        console.log(skipMessage('2Captcha', 'TWOCAPTCHA_API_KEY'));
        return;
      }

      solver = new TwoCaptchaService(envVars.TWOCAPTCHA_API_KEY);
    });

    it('should get balance from 2Captcha API', async () => {
      if (!envVars.TWOCAPTCHA_API_KEY) {
        console.log(
          '⏭️  Skipping 2Captcha balance test - API key not available',
        );
        return;
      }

      console.log('🔍 Testing 2Captcha balance endpoint...');

      const balance = await solver.getBalance();

      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);

      console.log(`✅ 2Captcha balance: $${balance}`);
    });

    it('should solve image captcha using 2Captcha API', async () => {
      if (!envVars.TWOCAPTCHA_API_KEY) {
        console.log(
          '⏭️  Skipping 2Captcha image captcha test - API key not available',
        );
        return;
      }

      console.log('🖼️  Testing 2Captcha image captcha solving...');

      // Verificar el balance antes de intentar resolver
      const balance = await solver.getBalance();
      if (balance <= 0) {
        console.log('⚠️  Skipping image captcha test - insufficient balance');
        return;
      }

      const solution = await solver.solveImageCaptcha(SAMPLE_CAPTCHA_BASE64);

      expect(typeof solution).toBe('string');
      expect(solution.length).toBeGreaterThan(0);
      expect(solution.trim()).not.toBe('');

      console.log(`✅ 2Captcha solution: "${solution}"`);
    }, 30000); // Timeout extendido para resolución de captcha
  });

  describe('Anti-Captcha Service Integration', () => {
    let solver: AntiCaptchaService;

    beforeEach(() => {
      if (!envVars.ANTICAPTCHA_API_KEY) {
        console.log(skipMessage('Anti-Captcha', 'ANTICAPTCHA_API_KEY'));
        return;
      }

      solver = new AntiCaptchaService(envVars.ANTICAPTCHA_API_KEY);
    });

    it('should get balance from Anti-Captcha API', async () => {
      if (!envVars.ANTICAPTCHA_API_KEY) {
        console.log(
          '⏭️  Skipping Anti-Captcha balance test - API key not available',
        );
        return;
      }

      console.log('🔍 Testing Anti-Captcha balance endpoint...');

      const balance = await solver.getBalance();

      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);

      console.log(`✅ Anti-Captcha balance: $${balance}`);
    });

    it('should solve image captcha using Anti-Captcha API', async () => {
      if (!envVars.ANTICAPTCHA_API_KEY) {
        console.log(
          '⏭️  Skipping Anti-Captcha image captcha test - API key not available',
        );
        return;
      }

      console.log('🖼️  Testing Anti-Captcha image captcha solving...');

      // Verificar el balance antes de intentar resolver
      const balance = await solver.getBalance();
      if (balance <= 0) {
        console.log('⚠️  Skipping image captcha test - insufficient balance');
        return;
      }

      const solution = await solver.solveImageCaptcha(SAMPLE_CAPTCHA_BASE64);

      expect(typeof solution).toBe('string');
      expect(solution.length).toBeGreaterThan(0);
      expect(solution.trim()).not.toBe('');

      console.log(`✅ Anti-Captcha solution: "${solution}"`);
    }, 30000);
  });

  describe('CapMonster Service Integration', () => {
    let solver: CapMonsterService;

    beforeEach(() => {
      if (!envVars.CAPMONSTER_API_KEY) {
        console.log(skipMessage('CapMonster', 'CAPMONSTER_API_KEY'));
        return;
      }

      solver = new CapMonsterService(envVars.CAPMONSTER_API_KEY);
    });

    it('should get balance from CapMonster API', async () => {
      if (!envVars.CAPMONSTER_API_KEY) {
        console.log(
          '⏭️  Skipping CapMonster balance test - API key not available',
        );
        return;
      }

      console.log('🔍 Testing CapMonster balance endpoint...');

      const balance = await solver.getBalance();

      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);

      console.log(`✅ CapMonster balance: $${balance}`);
    });

    it('should solve image captcha using CapMonster API', async () => {
      if (!envVars.CAPMONSTER_API_KEY) {
        console.log(
          '⏭️  Skipping CapMonster image captcha test - API key not available',
        );
        return;
      }

      console.log('🖼️  Testing CapMonster image captcha solving...');

      // Verificar el balance antes de intentar resolver
      const balance = await solver.getBalance();
      if (balance <= 0) {
        console.log('⚠️  Skipping image captcha test - insufficient balance');
        return;
      }

      const solution = await solver.solveImageCaptcha(SAMPLE_CAPTCHA_BASE64);

      expect(typeof solution).toBe('string');
      expect(solution.length).toBeGreaterThan(0);
      expect(solution.trim()).not.toBe('');

      console.log(`✅ CapMonster solution: "${solution}"`);
    }, 30000);
  });

  describe('Service Comparison and Validation', () => {
    it('should have consistent balance format across all services', async () => {
      const services = [
        {
          name: 'TwoCaptcha',
          ServiceClass: TwoCaptchaService,
          key: envVars.TWOCAPTCHA_API_KEY,
        },
        {
          name: 'AntiCaptcha',
          ServiceClass: AntiCaptchaService,
          key: envVars.ANTICAPTCHA_API_KEY,
        },
        {
          name: 'CapMonster',
          ServiceClass: CapMonsterService,
          key: envVars.CAPMONSTER_API_KEY,
        },
      ];

      const balances: { [service: string]: number } = {};

      for (const { name, ServiceClass, key } of services) {
        if (!key) {
          console.log(`⏭️  Skipping ${name} - API key not available`);
          continue;
        }

        console.log(`🔍 Comparing balance format for ${name}...`);

        const solver = new ServiceClass(key);
        const balance = await solver.getBalance();
        balances[name] = balance;

        // Validaciones comunes para todos los servicios
        expect(typeof balance).toBe('number');
        expect(balance).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(balance)).toBe(true);
        expect(Number.isNaN(balance)).toBe(false);
      }

      console.log('\n💰 Balance Summary:');
      Object.entries(balances).forEach(([service, balance]) => {
        console.log(`   ${service}: $${balance}`);
      });

      // Si hay múltiples servicios disponibles, verificar que todos retornan números válidos
      const availableServices = Object.keys(balances);
      if (availableServices.length > 1) {
        console.log(
          `✅ All ${availableServices.length} available services return consistent balance format`,
        );
      }
    });
  });

  afterAll(() => {
    console.log('\n🏁 Integration Tests Completed');

    const availableKeys = Object.values(envVars).filter(Boolean).length;
    const totalKeys = Object.keys(envVars).length;

    console.log(`📊 API Keys Available: ${availableKeys}/${totalKeys}`);

    if (availableKeys === 0) {
      console.log('\n⚠️  No API keys were provided for integration testing.');
      console.log(
        '   To run full integration tests, set the following environment variables:',
      );
      Object.keys(envVars).forEach((key) => {
        console.log(`   export ${key}=your_api_key`);
      });
    } else {
      console.log(
        `✅ Integration tests completed successfully for ${availableKeys} service(s)`,
      );
    }
  });
});
