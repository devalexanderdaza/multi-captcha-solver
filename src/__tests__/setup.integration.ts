/**
 * Setup file for integration tests
 * Configures environment and global settings for API testing
 */

// Configurar timeout global más alto para llamadas reales a APIs
jest.setTimeout(60000);

// Variables de entorno requeridas para pruebas de integración
const requiredEnvVars = [
  'TWOCAPTCHA_API_KEY',
  'ANTICAPTCHA_API_KEY',
  'CAPMONSTER_API_KEY',
];

// Función helper para verificar variables de entorno
const checkEnvironmentVariables = (): { [key: string]: string | undefined } => {
  const envVars: { [key: string]: string | undefined } = {};

  requiredEnvVars.forEach((envVar) => {
    envVars[envVar] = process.env[envVar];
  });

  return envVars;
};

// Hacer disponible globalmente para las pruebas
interface GlobalTestEnvironment {
  testEnvironment: {
    checkEnvironmentVariables: () => { [key: string]: string | undefined };
    requiredEnvVars: string[];
  };
}

(global as unknown as GlobalTestEnvironment).testEnvironment = {
  checkEnvironmentVariables,
  requiredEnvVars,
};

// Configurar manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('🔧 Integration test setup initialized');
