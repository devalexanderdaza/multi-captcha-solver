/**
 * Mock de node-fetch para pruebas unitarias
 * Este mock solo se aplica a las pruebas unitarias estándar
 */

interface MockResponse {
  ok: boolean;
  status: number;
  statusText: string;
  text: () => Promise<string>;
}

const mockFetch = jest.fn<Promise<MockResponse>, [string, RequestInit?]>(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    text: () => Promise.resolve('<html><body>Mock HTML</body></html>'),
  }),
);

export default mockFetch;

// También exportamos RequestInit para compatibilidad
export interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
  timeout?: number;
}
