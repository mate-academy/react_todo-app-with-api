import React, { useState } from 'react';
import { ErrorTypes } from '../../types/ErrorTypes';

interface ContextValues {
  error: ErrorTypes,
  setError: React.Dispatch<React.SetStateAction<ErrorTypes>>,
  isAdding: boolean,
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>,
  processedTodoIds: number[],
  setProcessedTodoIds: React.Dispatch<React.SetStateAction<number[]>>,
}

export const ProcessedContext = React.createContext<ContextValues>({
  error: ErrorTypes.GET,
  setError: () => {},
  isAdding: false,
  setIsAdding: () => {},
  processedTodoIds: [],
  setProcessedTodoIds: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ProcessedProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState<ErrorTypes>(ErrorTypes.NONE);
  const [isAdding, setIsAdding] = useState(false);
  const [processedTodoIds, setProcessedTodoIds] = useState<number[]>([]);

  const contextValue = {
    error,
    setError,
    isAdding,
    setIsAdding,
    processedTodoIds,
    setProcessedTodoIds,
  };

  return (
    <ProcessedContext.Provider value={contextValue}>
      {children}
    </ProcessedContext.Provider>
  );
};
