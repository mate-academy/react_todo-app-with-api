const BASE_URL = 'https://mate.academy/students-api';

// returns a promise resolved after a given delay
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// Define allowed request methods
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

// Make `data` accept a specific type instead of `any`
function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: unknown,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return wait(100)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: Record<string, unknown>) =>
    request<T>(url, 'POST', data),
  patch: <T>(url: string, data: Record<string, unknown>) =>
    request<T>(url, 'PATCH', data),
  delete: <T>(url: string) => request<T>(url, 'DELETE'),
};
