import React, { useState } from 'react';

interface LoaderProps {
  todosOnLoad: number[],
  setTodosOnLoad: React.Dispatch<React.SetStateAction<number[]>>,
}

export const LoaderContext = React.createContext<LoaderProps>({
  todosOnLoad: [],
  setTodosOnLoad: () => {},
});

interface ChildrenProps {
  children: React.ReactNode,
}

export const LoaderProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [todosOnLoad, setTodosOnLoad] = useState<number[]>([]);

  return (
    <LoaderContext.Provider value={{
      todosOnLoad,
      setTodosOnLoad,
    }}
    >
      {children}
    </LoaderContext.Provider>
  );
};
