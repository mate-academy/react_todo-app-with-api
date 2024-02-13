import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

interface TodosContextProps {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export const TodosContext = React.createContext<TodosContextProps>({
  todos: [],
  setTodos: () => { },
});

interface Props {
  children: React.ReactNode,
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodosContext.Provider>
  );
};
