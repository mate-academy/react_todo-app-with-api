import { ErrorMessage } from '../types/ErrorMessage';

export function clearNotification(
  callback: (error: ErrorMessage) => void,
  delay: number,
) {
  let timerId;

  window.clearTimeout(timerId);

  timerId = window.setTimeout(() => {
    callback(ErrorMessage.None);
  }, delay);
}
