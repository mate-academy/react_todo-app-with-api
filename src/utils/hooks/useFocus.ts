import { useRef, useEffect } from 'react';
import { useTodoContext } from '../../context/TodoContext';

export const useFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { lockedFocus } = useTodoContext();

  const setFocus = (element: HTMLInputElement | null) => {
    if (element) {
      element.focus();
    }
  };

  useEffect(() => {
    if (lockedFocus) {
      inputRef.current?.focus();
    }
  }, [lockedFocus]);

  return { inputRef, setFocus };
};
