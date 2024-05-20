import { useEffect } from 'react';
import { useAppContext } from './useAppContext';

export const useFocus = () => {
  const { inputRef } = useAppContext();

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return { inputRef };
};
