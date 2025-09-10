import { RefObject, useEffect } from 'react';

export const useInputFocus = (
  loadingTodos: number[],
  inputRef: RefObject<HTMLInputElement>,
) => {
  useEffect(() => {
    if (loadingTodos.length === 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loadingTodos, inputRef]);

  return inputRef;
};
