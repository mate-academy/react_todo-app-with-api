import { useCallback, useEffect, useState } from 'react';

export function useError(initialValue = '', delay = 3000) {
  const [error, setError] = useState<string>(initialValue);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setError(initialValue);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [error, delay, initialValue]);

  const clearError = useCallback(() => {
    setError(initialValue);
  }, [initialValue]);

  return {
    error,
    setError,
    clearError,
  };
}
