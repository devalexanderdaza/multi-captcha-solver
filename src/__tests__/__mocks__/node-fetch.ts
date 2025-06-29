/**
 * Mock configurado para pruebas de integración
 * Permite que node-fetch funcione correctamente en el entorno de Jest
 */

// Mock mínimo para node-fetch que permite el funcionamiento real
const fetch = jest.requireActual('node-fetch').default;

export default fetch;
export { RequestInit } from 'node-fetch';
