type TCallback = (newValue: string) => void;

export function waitToClose(delay: number, callback: TCallback) {
  return window.setTimeout(() => {
    callback('');
  }, delay);
}
