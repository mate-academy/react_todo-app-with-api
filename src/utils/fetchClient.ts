const BASE_URL = 'https://mate.academy/students-api';

type RequestOptions = {
  method?: string;
  body?: string;
};

function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
  };

  return fetch(BASE_URL + url, { ...options, headers }).then(response => {
    if (!response.ok) {
      throw new Error();
    }

    return response.json();
  });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: unknown) =>
    request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  patch: <T>(url: string, data: unknown) =>
    request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (url: string) => request(url, { method: 'DELETE' }),
};
