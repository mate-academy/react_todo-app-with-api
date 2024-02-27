/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'https://mate.academy/students-api';

const handleResponse = (response: Response) => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

export const client = {
  get(url: string) {
    return fetch(`${BASE_URL}/${url}`).then(handleResponse);
  },

  post(url: string, data: any) {
    return fetch(`${BASE_URL}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  delete(url: string) {
    return fetch(`${BASE_URL}/${url}`, {
      method: 'DELETE',
    }).then(handleResponse);
  },

  patch(url: string, data: any) {
    return fetch(`${BASE_URL}/${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
};
