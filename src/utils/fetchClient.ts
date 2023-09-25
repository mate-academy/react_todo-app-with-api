/* eslint-disable @typescript-eslint/no-explicit-any */
// podstawowy adres URL serwera do którego będą kierowane wszystkie żądania HTTP
const BASE_URL = 'https://mate.academy/students-api/';

// returns a promise resolved after a given delay
// funkcja pomocnicza zwraca Promis po określonym opóźnieniu,
// głównie aby móc zobaczyc loader na interfejsie
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// To have autocompletion and avoid mistypes
// enum wyliczający wszystkie typy stringa naszych żądań HTTP
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

// funkcja do wysyłania żądań HTTP do serwera
// funkcja request zwraca obietnicę zawierającą przekształcone dane JSON lub zgłasza błąd

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null, // we can send any data to the server
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    // We add body and Content-Type only for the requests with data
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  // we wait for testing purpose to see loaders
  return wait(0)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}

// obiekt client, który eksportuje cztery funkcje: get, post, patch i delete.
// Każda z tych funkcji jest opakowaniem wokół funkcji request z określoną metodą HTTP.

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request(url, 'DELETE'),
};
