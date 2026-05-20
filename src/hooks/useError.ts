import React from 'react';
import { ErrorType } from '../types/Errors';

export const useError = () => {
  const [error, setError] = React.useState<ErrorType | null>(null);

  React.useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  return {
    error,
    setError,
  };
};
