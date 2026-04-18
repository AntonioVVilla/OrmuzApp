import {withRetry} from '../../src/services/retry';

describe('withRetry', () => {
  it('returns the value on first success', async () => {
    const op = jest.fn().mockResolvedValue(42);
    const result = await withRetry(op, {
      maxAttempts: 3,
      baseDelayMs: 1,
      maxDelayMs: 2,
    });
    expect(result).toBe(42);
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('retries up to maxAttempts and then throws', async () => {
    const op = jest.fn().mockRejectedValue(new Error('boom'));
    await expect(
      withRetry(op, {maxAttempts: 3, baseDelayMs: 1, maxDelayMs: 2}),
    ).rejects.toThrow('boom');
    expect(op).toHaveBeenCalledTimes(3);
  });

  it('stops when shouldRetry returns false', async () => {
    const op = jest.fn().mockRejectedValue(new Error('fatal'));
    await expect(
      withRetry(op, {
        maxAttempts: 5,
        baseDelayMs: 1,
        maxDelayMs: 2,
        shouldRetry: () => false,
      }),
    ).rejects.toThrow('fatal');
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('succeeds on a later attempt', async () => {
    let tries = 0;
    const op = jest.fn().mockImplementation(async () => {
      tries += 1;
      if (tries < 3) {
        throw new Error('transient');
      }
      return 'ok';
    });
    const result = await withRetry(op, {
      maxAttempts: 5,
      baseDelayMs: 1,
      maxDelayMs: 2,
    });
    expect(result).toBe('ok');
    expect(op).toHaveBeenCalledTimes(3);
  });
});
