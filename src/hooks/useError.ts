import { useCallback, useRef } from 'react';
import { ErrorMessage } from '../types/Todo';

export const useError = (setErrorMessage: (error: ErrorMessage) => void) => {
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideError = useCallback(() => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    setErrorMessage(ErrorMessage.None);
  }, [setErrorMessage]);

  const showError = useCallback(
    (message: ErrorMessage, duration = 3000) => {
      setErrorMessage(message);
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }

      errorTimerRef.current = setTimeout(() => {
        setErrorMessage(ErrorMessage.None);
        errorTimerRef.current = null;
      }, duration);
    },
    [setErrorMessage],
  );

  return {
    hideError,
    showError,
    errorTimerRef,
  };
};
