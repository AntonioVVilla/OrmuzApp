import {RawAPIResponseSchema, RawAPIResponseParsed} from '../schemas/api';
import {withRetry} from './retry';

const API_BASE =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes';

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiSchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiSchemaError';
  }
}

function isAbortError(err: unknown): boolean {
  return err instanceof Error && err.name === 'AbortError';
}

function isRetriable(err: unknown): boolean {
  // Retry on transient network failures and 5xx responses. Do NOT
  // retry on schema errors — those are deterministic contract
  // mismatches that would just waste time and battery. Aborts
  // are user-initiated cancellations and must also be final.
  if (isAbortError(err)) {
    return false;
  }
  if (err instanceof ApiSchemaError) {
    return false;
  }
  if (err instanceof ApiError) {
    return err.status === undefined || err.status >= 500;
  }
  return true;
}

async function doFetch(
  provinceId: string,
  signal?: AbortSignal,
): Promise<RawAPIResponseParsed> {
  const url = `${API_BASE}/EstacionesTerrestres/FiltroProvincia/${provinceId}`;
  const response = await fetch(url, signal ? {signal} : undefined);
  if (!response.ok) {
    throw new ApiError(
      `API error: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  const rawJson: unknown = await response.json();
  const parseResult = RawAPIResponseSchema.safeParse(rawJson);
  if (!parseResult.success) {
    throw new ApiSchemaError(
      `Unexpected API response shape: ${parseResult.error.message}`,
    );
  }

  const data = parseResult.data;
  if (data.ResultadoConsulta !== 'OK') {
    throw new ApiError(`API returned: ${data.ResultadoConsulta}`);
  }
  return data;
}

export async function fetchStationsByProvince(
  provinceId: string,
  signal?: AbortSignal,
): Promise<RawAPIResponseParsed> {
  return withRetry(() => doFetch(provinceId, signal), {
    maxAttempts: 3,
    baseDelayMs: 500,
    maxDelayMs: 5000,
    shouldRetry: isRetriable,
  });
}
