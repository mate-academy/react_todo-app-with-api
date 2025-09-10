import { useEffect, useState } from 'react';
import { ErrorMessages } from '../types/enums';

export const useErrorReset = () => {
  const [currentError, setCurrentError] = useState<ErrorMessages | ''>('');

  useEffect(() => {
    if (!currentError) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentError]);

  return { currentError, setCurrentError };
};
