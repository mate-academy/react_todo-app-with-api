import React, { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';

interface TodosContextType {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export const TodosContext = React.createContext({} as TodosContextType);

type Props = {
  children: React.ReactNode,
};

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const value = {
    todos,
    setTodos,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  const todos = useContext(TodosContext);

  return todos;
};
