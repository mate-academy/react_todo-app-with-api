import React, { useContext, useState } from 'react';

interface LoadingTodosContextType {
  loadingTodos: number[],
  setLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>
}

export const LoadingTodosContext = React.createContext(
  {} as LoadingTodosContextType,
);

type Props = {
  children: React.ReactNode,
};

export const LoadingTodosContextProvider: React.FC<Props> = ({ children }) => {
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const value = {
    loadingTodos,
    setLoadingTodos,
  };

  return (
    <LoadingTodosContext.Provider value={value}>
      {children}
    </LoadingTodosContext.Provider>
  );
};

export const useLoadingTodos = () => useContext(LoadingTodosContext);
