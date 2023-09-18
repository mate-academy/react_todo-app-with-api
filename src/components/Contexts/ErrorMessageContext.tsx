import React, { useContext, useState } from 'react';

interface ErrorContextType {
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  isErrorHidden: boolean,
  setIsErrorHidden: React.Dispatch<React.SetStateAction<boolean>>,
}

export const ErrorMessageContext = React.createContext({} as ErrorContextType);

type Props = {
  children: React.ReactNode,
};

export const ErrorMessageContextProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  const value = {
    errorMessage,
    setErrorMessage,
    isErrorHidden,
    setIsErrorHidden,
  };

  return (
    <ErrorMessageContext.Provider value={value}>
      {children}
    </ErrorMessageContext.Provider>
  );
};

export const useErrorMessage = () => {
  const errorMessage = useContext(ErrorMessageContext);

  return errorMessage;
};
