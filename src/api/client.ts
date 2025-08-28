// File: src/api/client.ts
const BASE_URL = 'https://mate.academy/students-api';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: data ? { 'Content-Type': 'application/json; charset=UTF-8' } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    throw new Error(`${method} ${url} failed with ${res.status}`);
  }

  return res.json();
}

export const client = {
  get: <T>(url: string) => request<T>(url, 'GET'),
  post: <T>(url: string, data: unknown) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: unknown) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request<void>(url, 'DELETE'),
};
