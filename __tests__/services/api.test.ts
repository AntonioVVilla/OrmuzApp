import {
  ApiError,
  ApiSchemaError,
  fetchStationsByProvince,
} from '../../src/services/api';

const okResponse = {
  Fecha: '2026-04-18',
  ListaEESSPrecio: [],
  ResultadoConsulta: 'OK',
};

describe('fetchStationsByProvince', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = (globalThis as {fetch: typeof fetch}).fetch;
  });

  afterEach(() => {
    (globalThis as {fetch: typeof fetch}).fetch = originalFetch;
  });

  it('returns parsed data on success', async () => {
    (globalThis as {fetch: typeof fetch}).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(okResponse),
    }) as unknown as typeof fetch;
    const data = await fetchStationsByProvince('28');
    expect(data.ResultadoConsulta).toBe('OK');
  });

  it('throws ApiError on non-200 response after retries', async () => {
    (globalThis as {fetch: typeof fetch}).fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch;
    await expect(fetchStationsByProvince('28')).rejects.toBeInstanceOf(
      ApiError,
    );
  }, 20000);

  it('does not retry schema errors', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({unexpected: true}),
    });
    (globalThis as {fetch: typeof fetch}).fetch = fetchMock as unknown as typeof fetch;
    await expect(fetchStationsByProvince('28')).rejects.toBeInstanceOf(
      ApiSchemaError,
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws when the payload reports a non-OK result', async () => {
    (globalThis as {fetch: typeof fetch}).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({...okResponse, ResultadoConsulta: 'ERROR'}),
    }) as unknown as typeof fetch;
    await expect(fetchStationsByProvince('28')).rejects.toBeInstanceOf(
      ApiError,
    );
  }, 20000);
});
