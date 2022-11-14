import { useState } from 'react';

function useError() {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const clearError = () => {
    setIsError(false);
    setErrorMessage('');
  };

  const addError = (message: string) => {
    setIsError(true);
    setErrorMessage(message);

    setTimeout(() => {
      clearError();
    }, 3000);
  };

  return {
    isError,
    addError,
    clearError,
    errorMessage,
  };
}

export { useError };
