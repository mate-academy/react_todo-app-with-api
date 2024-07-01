import React, { useCallback, useContext, useState } from 'react';
import { ErrorMessageContextValue } from '../../types/contextValues';
import { HandleErrorMessageSend } from '../../types/handlers';

const ErrorMessageContext =
  React.createContext<ErrorMessageContextValue | null>(null);
const ErrorNotificationApiContext =
  React.createContext<HandleErrorMessageSend | null>(null);

type Props = React.PropsWithChildren;

export const ErrorNotificationProvider = ({ children }: Props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [sendError, setSendError] = useState(false);

  const handleErrorMessageSend = useCallback((newErrorMessage: string) => {
    setErrorMessage(newErrorMessage);
    setSendError(true);
    setTimeout(setSendError, 0, false);
  }, []);

  const errorValue = {
    errorMessage,
    sendError,
  };

  return (
    <ErrorNotificationApiContext.Provider value={handleErrorMessageSend}>
      <ErrorMessageContext.Provider value={errorValue}>
        {children}
      </ErrorMessageContext.Provider>
    </ErrorNotificationApiContext.Provider>
  );
};

export const useErrorNotificationErrorMessage = () => {
  const value = useContext(ErrorMessageContext);

  if (!value) {
    throw new Error('ErrorProvider is missing!!!');
  }

  return value;
};

export const useErrorNotificationApi = () => {
  const value = useContext(ErrorNotificationApiContext);

  if (!value) {
    throw new Error('ErrorProvider is missing!!!');
  }

  return value;
};
