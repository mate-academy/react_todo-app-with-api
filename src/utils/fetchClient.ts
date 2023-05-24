const BASE_URL = 'https://mate.academy/students-api';

function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

enum RequestMethodType {
  Get = 'GET',
  Post = 'POST',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

function request<T>(
  url: string,
  method: RequestMethodType = RequestMethodType.Get,
  data: {} | null = null,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return wait(300)
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
  post: <T>(
    url: string, data: {},
  ) => request<T>(url, RequestMethodType.Post, data),
  patch: <T>(
    url: string, data: {},
  ) => request<T>(url, RequestMethodType.Patch, data),
  delete: (
    url: string,
  ) => request(url, RequestMethodType.Delete),
};
