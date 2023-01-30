import { useCallback, useState } from 'react';

type HookOutput = [
  (message: string) => void,
  (message: string) => void,
  string[],
];

export const useErrors = (initialErrors = []): HookOutput => {
  const [errorMessages, setErrorMessages] = useState<string[]>(initialErrors);

  const closeError = useCallback((message: string) => {
    setErrorMessages(prev => {
      const messageIndex = prev.indexOf(message);

      const messagesCopy = [...prev];

      messagesCopy.splice(messageIndex, 1);

      return messagesCopy;
    });
  }, []);

  const showErrorMessage = useCallback((message: string) => {
    setErrorMessages(prev => [...prev, message]);

    setTimeout(() => {
      closeError(message);
    }, 3000);
  }, []);

  return [showErrorMessage, closeError, errorMessages];
};
