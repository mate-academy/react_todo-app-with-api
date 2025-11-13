import { useState, useEffect, useRef, useCallback } from 'react';

export const useErrorNotification = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (errorMessage) {
      timerRef.current = setTimeout(() => {
        setErrorMessage(null);
        timerRef.current = null;
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [errorMessage]);

  const handleHideError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    errorMessage,
    setErrorMessage,
    handleHideError,
  };
};
