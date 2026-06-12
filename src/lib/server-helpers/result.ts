export type HelperErrorCode = 'invalid_input' | 'not_found' | 'storage_error';

export type HelperError = {
  code: HelperErrorCode;
  message: string;
};

export type HelperResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: HelperError };

export function ok<T>(data: T): HelperResult<T> {
  return { ok: true, data };
}

export function fail(code: HelperErrorCode, message: string): HelperResult<never> {
  return { ok: false, error: { code, message } };
}

export function hasText(value: string): boolean {
  return value.trim().length > 0;
}
