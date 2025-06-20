export default {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }],
  },
  // --- LÍNEA AÑADIDA PARA SOLUCIONAR EL ERROR ---
  // Jest por defecto ignora todo en node_modules. Esta regla le dice que NO ignore
  // los paquetes que son ESM puros y necesitan ser transformados.
  transformIgnorePatterns: ['/node_modules/(?!wrap-ansi|cliui|yargs)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mts',
    '!src/**/*.d.ts',
    '!src/**/*.d.mts',
  ],
  // Quality Gates: Umbrales de cobertura de pruebas
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 88, // Configurado para el estado actual de cobertura
      lines: 90,
      statements: 90,
    },
  },
};
