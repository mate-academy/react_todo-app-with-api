import { useRef } from 'react';

export const useInputRef = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => inputRef.current?.focus();

  const disableInput = () => {
    if (inputRef.current) {
      inputRef.current.disabled = true;
    }
  };

  const enableInput = () => {
    if (inputRef.current) {
      inputRef.current.disabled = false;
    }
  };

  return { inputRef, focusInput, disableInput, enableInput };
};
