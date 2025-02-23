const BASE_URL = 'https://mate.academy/students-api';

function wait(delay: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: unknown, // Замість any використовуйте unknown
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  await wait(100);

  const response = await fetch(BASE_URL + url, options);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>; // Явно вказуємо тип
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data?: unknown) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data?: unknown) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request<void>(url, 'DELETE'),
};
