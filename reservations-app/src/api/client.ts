const DEFAULT_BASE_URL = 'https://khmockapi.azurewebsites.net';

const BASE_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_API_BASE_URL) ||
  DEFAULT_BASE_URL;

const CALLER_ID = 'Hanting';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const parseJsonSafe = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(
      response.status,
      'Failed to parse JSON response from server',
    );
  }
};

export const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${BASE_URL}${path}`;

  const headers: HeadersInit = {
    'X-Caller-Id': CALLER_ID,
    ...(options.headers ?? {}),
  };

  const init: RequestInit = {
    ...options,
    headers,
  };

  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (error) {
    throw new ApiError(
      0,
      error instanceof Error ? error.message : 'Network request failed',
    );
  }

  if (!response.ok) {
    const body = await parseJsonSafe(response).catch(() => null);
    const message =
      (body as { message?: string } | null)?.message ??
      `Request failed with status ${response.status}`;

    throw new ApiError(response.status, message);
  }

  const data = (await parseJsonSafe(response)) as T;
  return data;
};
