export const warningTimer = (
  callback: (value: boolean) => void,
  value: boolean,
  delay: number,
) => {
  let timerId;

  window.clearTimeout(timerId);

  timerId = window.setTimeout(() => {
    callback(value);
  }, delay);
};
