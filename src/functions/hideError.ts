import { Errors } from '../types/Errors';

export const DELAY_ERROR_HIDE = 3000;

let timeoutId: NodeJS.Timeout | null = null;

export const hideError = (callback: (v: Errors) => void) => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    callback(Errors.NoError);
    timeoutId = null;
  }, DELAY_ERROR_HIDE);

  return timeoutId;
};
