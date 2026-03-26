export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function cmsApiFetch<T>(
  path: string,
  apiKey: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`/api/cms${path}`, {
    ...options,
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    throw new ApiError("Unauthorized", 401);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body.error || `Request failed with status ${res.status}`,
      res.status,
    );
  }

  if (res.status === 204 || options?.method === "DELETE") {
    return {} as T;
  }

  return res.json();
}
