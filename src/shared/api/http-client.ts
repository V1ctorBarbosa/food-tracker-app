import { auth } from '@/shared/api/firebase';
import { apiBaseUrl } from '@/shared/config/api-config';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
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

async function buildAuthHeaders(): Promise<HeadersInit> {
  const idToken = await auth.currentUser?.getIdToken();
  if (idToken === undefined) {
    throw new Error('Cannot call the API without a signed-in user.');
  }

  return { Authorization: `Bearer ${idToken}` };
}

async function parseJsonOrThrow<TResponse>(response: Response): Promise<TResponse> {
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}.`);
  }

  return (await response.json()) as TResponse;
}
