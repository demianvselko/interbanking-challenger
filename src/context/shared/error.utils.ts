export function normalizeError(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  return fallback;
}
