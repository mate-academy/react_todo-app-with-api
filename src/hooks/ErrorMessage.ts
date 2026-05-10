import { useState, useEffect } from 'react';

export const useErrorMessage = () => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  return [errorMessage, setErrorMessage] as const;
};
