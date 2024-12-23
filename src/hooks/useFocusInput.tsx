import { useEffect, useRef } from 'react';

/* eslint-disable-next-line */
export const useFocusInput = (...args: any[]) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [...args]);

  return inputRef;
};
