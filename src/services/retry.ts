export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 5000,
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  opts: Partial<RetryOptions> = {},
): Promise<T> {
  const options = {...DEFAULT_OPTIONS, ...opts};
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      const isLastAttempt = attempt === options.maxAttempts;
      const canRetry = options.shouldRetry
        ? options.shouldRetry(err, attempt)
        : true;
      if (isLastAttempt || !canRetry) {
        break;
      }
      const backoff = Math.min(
        options.baseDelayMs * 2 ** (attempt - 1),
        options.maxDelayMs,
      );
      const jitter = Math.random() * 0.3 * backoff;
      await delay(backoff + jitter);
    }
  }

  throw lastError;
}
