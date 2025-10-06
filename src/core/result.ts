export type Result<T> = { ok: true; body: T } | { ok: false; error: string };
