/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'https://mate.academy/students-api';

async function wait(delay: number) {
  const waited = await new Promise(resolve => {
    setTimeout(resolve, delay);
  });

  return waited;
}

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  try {
    await wait(100);
    const fetched = await fetch(BASE_URL + url, options);

    if (!fetched.ok) {
      throw new Error(` ${fetched.status} ${fetched.statusText}`);
    }

    return await fetched.json();
  } catch (error) {
    throw new Error(`Request failed: ${error}`);
  }
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request(url, 'DELETE'),
};
