/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'https://todo-backend-7ohh.onrender.com';

// returns a promise resolved after a given delay
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// To have autocompletion and avoid mistypes
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null, // we can send any data to the server
): Promise<T> {
  const options: RequestInit = { method };

  const headers: Record<string, string> = {};

  if (data) {
    // We add body and Content-Type only for the requests with data
    options.body = JSON.stringify(data);
    headers['Content-Type'] = 'application/json; charset=UTF-8';
  }

  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  options.headers = headers;

  return wait(100)
    .then(() => fetch(BASE_URL + url, options))
    .then(async response => {
      if (!response.ok) {
        let errorData;

        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }

        throw {
          response: {
            status: response.status,
            data: errorData,
          },
        };
      }

      return response.json();
    });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request(url, 'DELETE'),
};
