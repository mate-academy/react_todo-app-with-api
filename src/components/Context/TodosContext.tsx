import React, { FunctionComponent, useState } from 'react';
import { Todo } from '../../types/Todo';

export interface TodosContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodosContext = React.createContext<TodosContextType | []>([]);

type TodosProps = { children: React.ReactNode };

export const TodosProvider: FunctionComponent<TodosProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodosContext.Provider>
  );
};
