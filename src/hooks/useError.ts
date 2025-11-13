import { useState, useEffect, useCallback } from 'react';

export const useError = () => {
  const [error, setError] = useState('');

  const handleRemoveError = useCallback(() => setError(''), []);

  const handleSetError = useCallback(
    (errorText: string) => setError(errorText),
    [],
  );

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(handleRemoveError, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error, handleRemoveError]);

  return {
    error,
    handleRemoveError,
    handleSetError,
  };
};
