import React, { useState } from 'react';

interface LoaderProps {
  todoOnLoad: number,
  setTodoOnLoad:(text: number) => void,
  todosOnLoad: number[],
  setTodosOnLoad: (text: number[]) => void,
}

export const LoaderContext = React.createContext<LoaderProps>({
  todoOnLoad: -1,
  setTodoOnLoad: () => {},
  todosOnLoad: [],
  setTodosOnLoad: () => {},
});

interface ChildrenProps {
  children: React.ReactNode,
}

export const LoaderProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [todoOnLoad, setTodoOnLoad] = useState(-1);
  const [todosOnLoad, setTodosOnLoad] = useState<number[]>([]);

  return (
    <LoaderContext.Provider value={{
      todoOnLoad,
      setTodoOnLoad,
      todosOnLoad,
      setTodosOnLoad,
    }}
    >
      {children}
    </LoaderContext.Provider>
  );
};
