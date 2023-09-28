import React, { useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

export const ErrorContext = React.createContext({
  errorMessage: ErrorMessage.None,
  setErrorMessage: () => {},
  onNewError: () => {},
} as ErrorContextProps);

type ErrorContextProps = {
  errorMessage: ErrorMessage,
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage>>,
  onNewError: (error: ErrorMessage) => void,
};

type Props = {
  children: React.ReactNode,
};

export const ErrorContextProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );

  const onNewError = (error: ErrorMessage) => {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);
  };

  const initialValue = {
    errorMessage,
    setErrorMessage,
    onNewError,
  };

  return (
    <ErrorContext.Provider value={initialValue}>
      {children}
    </ErrorContext.Provider>
  );
};
