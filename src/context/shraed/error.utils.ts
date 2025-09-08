export function normalizeError(err: unknown, fallback: string): Error {
    if (err instanceof Error) return err;
    return new Error(fallback);
}
