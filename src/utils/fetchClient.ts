/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_CONFIG, TIMEOUTS } from '../constants';

const BASE_URL = API_CONFIG.BASE_URL;

// returns a promise resolved after a given delay
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// To have autocompletion and avoid mistypes
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function requestWithRetry<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null,
  retries = API_CONFIG.MAX_RETRIES,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // DON'T change the delay it is required for tests
      await wait(TIMEOUTS.API_DELAY);
      const response = await fetch(BASE_URL + url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      await wait(API_CONFIG.RETRY_DELAY * Math.pow(2, attempt));
    }
  }

  throw new Error('Max retries exceeded');
}

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null,
): Promise<T> {
  return requestWithRetry(url, method, data);
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request(url, 'DELETE'),
};
