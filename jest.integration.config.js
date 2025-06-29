export default {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }],
  },
  // Jest por defecto ignora todo en node_modules. Esta regla le dice que NO ignore
  // los paquetes que son ESM puros y necesitan ser transformados.
  transformIgnorePatterns: [
    '/node_modules/(?!wrap-ansi|cliui|yargs|node-fetch)',
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
  },
  // Configuración específica para pruebas de integración
  testRegex: '.*\\.integration\\.spec\\.(m)?ts$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/coverage/',
    '/src/__tests__/setup.integration.ts',
    '/src/__tests__/__mocks__/',
  ],
  // Las pruebas de integración NO deben usar mocks - usar APIs reales
  moduleDirectories: ['node_modules'],
  // Timeout extendido para llamadas reales a APIs
  testTimeout: 60000,
  // Configuración de cobertura deshabilitada para pruebas de integración
  collectCoverage: false,
  // Variables de entorno para pruebas de integración
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.integration.ts'],
  // Ejecutar pruebas en serie para evitar límites de API
  maxWorkers: 1,
  // Verbose para mejor debugging de pruebas de integración
  verbose: true,
};
