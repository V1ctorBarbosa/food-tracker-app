import { authGateway } from '@/shared/api/auth-gateway';
import { apiBaseUrl } from '@/shared/config/api-config';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errorCode: string | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function getJson<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: await buildAuthHeaders(),
  });

  return parseJsonOrThrow<TResponse>(response);
}

export async function putJson<TRequest, TResponse>(path: string, requestBody: TRequest): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'PUT',
    headers: { ...(await buildAuthHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  return parseJsonOrThrow<TResponse>(response);
}

export async function postJson<TRequest, TResponse>(path: string, requestBody: TRequest): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { ...(await buildAuthHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  return parseJsonOrThrow<TResponse>(response);
}

export async function deleteRequest(path: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'DELETE',
    headers: await buildAuthHeaders(),
  });

  if (!response.ok) {
    throw await buildApiError(response);
  }
}

async function buildAuthHeaders(): Promise<Record<string, string>> {
  const idToken = await authGateway.getIdToken();
  if (idToken === null) {
    throw new Error('Cannot call the API without a signed-in user.');
  }

  return { Authorization: `Bearer ${idToken}` };
}

async function parseJsonOrThrow<TResponse>(response: Response): Promise<TResponse> {
  if (!response.ok) {
    throw await buildApiError(response);
  }

  return (await response.json()) as TResponse;
}

type ErrorResponseBody = { errorCode: string; message: string };

/** Parses the backend's `{ errorCode, message }` error body when present, falling back to a generic message otherwise. */
async function buildApiError(response: Response): Promise<ApiError> {
  const body = await tryParseErrorBody(response);

  if (body === null) {
    return new ApiError(response.status, `Request failed with status ${response.status}.`);
  }

  return new ApiError(response.status, body.message, body.errorCode);
}

async function tryParseErrorBody(response: Response): Promise<ErrorResponseBody | null> {
  try {
    const json: unknown = await response.json();
    if (isErrorResponseBody(json)) {
      return json;
    }

    return null;
  } catch {
    return null;
  }
}

function isErrorResponseBody(value: unknown): value is ErrorResponseBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.errorCode === 'string' && typeof candidate.message === 'string';
}
