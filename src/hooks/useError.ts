import { useEffect, useState } from 'react';
import { ErrorType } from '../types/Error';

export const useError = () => {
  const [error, setError] = useState<ErrorType>('');

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  return { error, setError };
};
