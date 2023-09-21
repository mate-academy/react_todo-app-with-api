import React, { useContext, useState } from 'react';
import { LoadingTodo } from '../../types/LoadingTodo';

interface LoadingTodosContextType {
  loadingTodos: LoadingTodo[],
  setLoadingTodos: React.Dispatch<React.SetStateAction<LoadingTodo[]>>
}

export const LoadingTodosContext = React.createContext(
  {} as LoadingTodosContextType,
);

type Props = {
  children: React.ReactNode,
};

export const LoadingTodosContextProvider: React.FC<Props> = ({ children }) => {
  const [loadingTodos, setLoadingTodos] = useState<LoadingTodo[]>([]);

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

export const useLoadingTodos = () => {
  const loadingTodos = useContext(LoadingTodosContext);

  return loadingTodos;
};
