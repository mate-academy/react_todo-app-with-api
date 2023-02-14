import { useCallback, useState } from 'react';

type HookOutput = [
  (m:string) => void,
  () => void,
  string,
];

export const useError = ():HookOutput => {
  const [errorMessage, setErrorMessage] = useState('');
  const closeErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => closeErrorMessage(), 3000);
  }, []);

  return [showError, closeErrorMessage, errorMessage];
};
