/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'https://mate.academy/students-api';

// returns a promise resolved after a given delay
function wait(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

function request<T>(
  url: string,
  method: RequestMethod = RequestMethod.GET,
  data: any = null,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  // we wait for testing purpose to see loaders
  return wait(300)
    .then(() => fetch(BASE_URL + url, options))
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
}

export const client = {
  get: <T>(url: string) => {
    return request<T>(url);
  },
  post: <T>(url: string, data: any) => {
    return request<T>(url, RequestMethod.POST, data);
  },
  patch: <T>(url: string, data: any) => {
    return request<T>(url, RequestMethod.PATCH, data);
  },
  delete: (url: string) => {
    return request(url, RequestMethod.DELETE);
  },
};
