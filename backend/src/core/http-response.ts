import type { Result } from "./result.ts";

export interface HttpResponse<T> {
  statusCode: number;
  body: T | { error: string };
}

export function toHttpResponse<T>(
  result: Result<T>,
  successStatus: number = 200,
  errorStatus: number = 500
): HttpResponse<T> {
  if (!result.ok)
    return { statusCode: errorStatus, body: { error: result.error } };

  return { statusCode: successStatus, body: result.body };
}
