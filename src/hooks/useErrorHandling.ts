import { useState, useCallback, useRef } from 'react';

export const useErrorHandling = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetErrorMessage = useCallback((message: string) => {
    setErrorMessage(message);

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    errorTimerRef.current = setTimeout(() => {
      setErrorMessage('');
      errorTimerRef.current = null;
    }, 3000);
  }, []);

  const handleClearErrorMessage = useCallback(() => {
    setErrorMessage('');
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
  }, []);

  return {
    errorMessage,
    handleSetErrorMessage,
    handleClearErrorMessage,
  };
};
