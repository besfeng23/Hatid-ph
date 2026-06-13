export type HelperErrorCode = 'auth_required' | 'invalid_input' | 'not_found' | 'storage_error';

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

export function normalizeText(value: string | null | undefined): string | null {
  if (value == null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function requireText(value: string, fieldName = 'value'): HelperResult<string> {
  const normalized = normalizeText(value);

  if (!normalized) {
    return fail('invalid_input', `${fieldName} is required.`);
  }

  return ok(normalized);
}

export function pickDefined<T extends Record<string, unknown>>(values: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}
