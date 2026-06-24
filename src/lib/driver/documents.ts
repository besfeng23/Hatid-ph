export type DriverDocumentInput = {
  vehicle_id?: string | null;
  document_type: string;
  storage_path: string;
  file_name?: string | null;
  mime_type?: string | null;
};

export type SafeDriverDocument = {
  id: string;
  vehicle_id: string | null;
  document_type: string;
  storage_path: string;
  file_name: string | null;
  mime_type: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

export type DriverDocumentsResult =
  | { ok: true; data: SafeDriverDocument[] }
  | { ok: false; error: { message: string } };

export type DriverDocumentResult =
  | { ok: true; data: SafeDriverDocument }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type DriverDocumentRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcDriverDocumentRow = {
  id?: unknown;
  vehicle_id?: unknown;
  document_type?: unknown;
  storage_path?: unknown;
  file_name?: unknown;
  mime_type?: unknown;
  status?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

const SAFE_DRIVER_DOCUMENTS_LOAD_ERROR = 'We could not load your driver documents right now.';
const SAFE_DRIVER_DOCUMENT_SUBMIT_ERROR = 'We could not submit this document right now. Please try again.';

function normalizeRequiredText(value: string) {
  return value.trim();
}

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed.length > 0 ? trimmed : null;
}

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function toSafeDriverDocument(row: RpcDriverDocumentRow | null | undefined): SafeDriverDocument {
  return {
    id: stringOrNull(row?.id) ?? '',
    vehicle_id: stringOrNull(row?.vehicle_id),
    document_type: stringOrNull(row?.document_type) ?? 'other',
    storage_path: stringOrNull(row?.storage_path) ?? '',
    file_name: stringOrNull(row?.file_name),
    mime_type: stringOrNull(row?.mime_type),
    status: stringOrNull(row?.status) ?? 'submitted',
    created_at: stringOrNull(row?.created_at),
    updated_at: stringOrNull(row?.updated_at),
  };
}

export async function getMyDriverDocuments(client: DriverDocumentRpcClient): Promise<DriverDocumentsResult> {
  try {
    const { data, error } = await client.rpc<RpcDriverDocumentRow>('get_my_driver_documents');

    if (error) {
      return { ok: false, error: { message: SAFE_DRIVER_DOCUMENTS_LOAD_ERROR } };
    }

    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return { ok: true, data: rows.map(toSafeDriverDocument) };
  } catch {
    return { ok: false, error: { message: SAFE_DRIVER_DOCUMENTS_LOAD_ERROR } };
  }
}

export async function submitMyDriverDocument(
  client: DriverDocumentRpcClient,
  input: DriverDocumentInput,
): Promise<DriverDocumentResult> {
  try {
    const { data, error } = await client.rpc<RpcDriverDocumentRow>('submit_my_driver_document', {
      p_vehicle_id: input.vehicle_id ?? null,
      p_document_type: normalizeRequiredText(input.document_type),
      p_storage_path: normalizeRequiredText(input.storage_path),
      p_file_name: normalizeOptionalText(input.file_name),
      p_mime_type: normalizeOptionalText(input.mime_type),
    });

    if (error) {
      return { ok: false, error: { message: SAFE_DRIVER_DOCUMENT_SUBMIT_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: toSafeDriverDocument(row) };
  } catch {
    return { ok: false, error: { message: SAFE_DRIVER_DOCUMENT_SUBMIT_ERROR } };
  }
}
