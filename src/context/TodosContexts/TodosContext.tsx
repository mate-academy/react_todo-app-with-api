import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

interface ITodosContext {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodosContext = React.createContext({} as ITodosContext);

type Props = {
  children: React.ReactNode;
};

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
