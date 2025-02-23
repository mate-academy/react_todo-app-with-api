import React, { createContext, useContext, useState } from 'react';
import {
  ErrorMessageContextValue,
  ErrorMessageContextHandlers,
} from '../../types/ContextValues';

/* eslint-disable */
export const ErrorMessageContext = createContext<
  (ErrorMessageContextValue & ErrorMessageContextHandlers) | null
>(null);
/* eslint-enable */

type Props = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSendError, setIsSendError] = useState(false);

  const handleErrorMessageSend = (newMessage: string) => {
    setErrorMessage(newMessage);
    setIsSendError(true);
    setTimeout(() => {
      setIsSendError(false);
    }, 0);
  };

  const handleErrorMessageClear = () => {
    setErrorMessage('');
  };

  const errorValue = {
    errorMessage,
    sendError: isSendError,
    handleErrorMessageSend,
    handleErrorMessageClear,
  };

  return (
    <ErrorMessageContext.Provider value={errorValue}>
      {children}
    </ErrorMessageContext.Provider>
  );
};

export const useErrorMessage = () => {
  const value = useContext(ErrorMessageContext);

  if (!value) {
    throw new Error('Something is wrong with provider ErrorMessageContext');
  }

  return value;
};
