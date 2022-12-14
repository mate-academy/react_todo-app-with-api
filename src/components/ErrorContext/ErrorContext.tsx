import React, { useState } from 'react';
import { ErrorTypes } from '../../types/ErrorTypes';

interface ContextValues {
  error: ErrorTypes,
  setError: (error: ErrorTypes) => void,
  isAdding: boolean,
  setIsAdding: (isAdding: boolean) => void
}

export const ErrorContext = React.createContext<ContextValues>({
  error: ErrorTypes.GET,
  setError: () => {},
  isAdding: false,
  setIsAdding: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState<ErrorTypes>(ErrorTypes.NONE);
  const [isAdding, setIsAdding] = useState(false);

  const contextValue = {
    error,
    setError,
    isAdding,
    setIsAdding,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};
