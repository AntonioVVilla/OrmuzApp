export type AppErrorCode =
  | 'NETWORK'
  | 'PARSE'
  | 'PERMISSION'
  | 'OFFLINE_STALE'
  | 'UNKNOWN';

export interface AppError {
  code: AppErrorCode;
  message: string;
}

export function toAppError(input: unknown, fallbackCode: AppErrorCode = 'UNKNOWN'): AppError {
  if (isAppError(input)) {
    return input;
  }
  if (input instanceof Error) {
    return {code: fallbackCode, message: input.message};
  }
  if (typeof input === 'string') {
    return {code: fallbackCode, message: input};
  }
  return {code: fallbackCode, message: 'Unknown error'};
}

export function isAppError(value: unknown): value is AppError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    typeof (value as AppError).code === 'string' &&
    typeof (value as AppError).message === 'string'
  );
}
