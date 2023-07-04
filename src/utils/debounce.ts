export const debounce = (
  func: () => void,
  timeout: number,
) => {
  let timerID: NodeJS.Timeout;

  return () => {
    clearTimeout(timerID);
    timerID = setTimeout(func, timeout);
  };
};
