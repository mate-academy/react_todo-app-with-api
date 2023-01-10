import React, { useState } from 'react';

import { Errors } from '../../types/Errors';

interface ContextValues {
  currentError: Errors;
  setCurrentError: React.Dispatch<React.SetStateAction<Errors>>;
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  isAdding: boolean;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTodoIds: number[];
  setSelectedTodoIds: React.Dispatch<React.SetStateAction<number[]>>
}

export const ErrorContext = React.createContext<ContextValues>({
  currentError: Errors.NoError,
  setCurrentError: () => {},
  hasError: false,
  setHasError: () => {},
  isAdding: false,
  setIsAdding: () => { },
  selectedTodoIds: [0],
  setSelectedTodoIds: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [currentError, setCurrentError] = useState<Errors>(Errors.NoError);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([0]);

  const contextValues = {
    currentError,
    setCurrentError,
    hasError,
    setHasError,
    isAdding,
    setIsAdding,
    selectedTodoIds,
    setSelectedTodoIds,
  };

  return (
    <ErrorContext.Provider value={contextValues}>
      {children}
    </ErrorContext.Provider>
  );
};
