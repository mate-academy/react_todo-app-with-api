import React, { useState } from 'react';

interface ILoadingTodosContext {
  todosIdToDelete: number[];
  setTodosIdToDelete: React.Dispatch<React.SetStateAction<number[]>>;
  todosIdToUpdate: number[];
  setTodosIdToUpdate: React.Dispatch<React.SetStateAction<number[]>>;
}

export const LoadingTodosContext = React
  .createContext({} as ILoadingTodosContext);

type Props = {
  children: React.ReactNode;
};

export const LoadingTodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todosIdToDelete, setTodosIdToDelete] = useState<number[]>([]);
  const [todosIdToUpdate, setTodosIdToUpdate] = useState<number[]>([]);

  return (
    <LoadingTodosContext.Provider value={{
      todosIdToDelete,
      setTodosIdToDelete,
      todosIdToUpdate,
      setTodosIdToUpdate,
    }}
    >
      {children}
    </LoadingTodosContext.Provider>
  );
};
