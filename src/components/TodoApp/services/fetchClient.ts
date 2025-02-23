import { BASE_URL } from '../../../constants/userdata';

// returns a promise resolved after a given delay
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// To have autocompletion and avoid mistypes
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T, TData = unknown>(
  url: string,
  method: RequestMethod = 'GET',
  data?: TData, // we can send any data to the server
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    // We add body and Content-Type only for the requests with data
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  // DON'T change the delay it is required for tests
  return wait(100)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
}

export const client = {
  get: <T>(url: string) => request<T>(url),

  post: <T, TData = unknown>(url: string, data: TData) =>
    request<T, TData>(url, 'POST', data),

  patch: <T, TData = unknown>(url: string, data: TData) =>
    request<T, TData>(url, 'PATCH', data),

  delete: (url: string) => request(url, 'DELETE'),
};
