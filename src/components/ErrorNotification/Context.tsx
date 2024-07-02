import React, { useContext, useMemo, useState } from 'react';
import {
  ErrorMessageContextValue,
  ErrorNotificationApiContextValue,
} from '../../types/contextValues';

const ErrorMessageContext =
  React.createContext<ErrorMessageContextValue | null>(null);
const ErrorNotificationApiContext =
  React.createContext<ErrorNotificationApiContextValue | null>(null);

type Props = React.PropsWithChildren;

export const ErrorNotificationProvider = ({ children }: Props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [sendError, setSendError] = useState(false);

  const handleErrorMessageSend = (newErrorMessage: string) => {
    setErrorMessage(newErrorMessage);
    setSendError(true);
    setTimeout(setSendError, 0, false);
  };

  const handleErrorMessageClear = () => {
    setErrorMessage('');
  };

  const errorValue = {
    errorMessage,
    sendError,
  };

  const apiValue = useMemo(
    () => ({
      handleErrorMessageSend,
      handleErrorMessageClear,
    }),
    [],
  );

  return (
    <ErrorNotificationApiContext.Provider value={apiValue}>
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
