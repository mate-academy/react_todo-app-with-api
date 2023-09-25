import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

export const TodosContext = React.createContext({
  todos: [],
  setTodos: () => {},
  todoIdsWithLoader: [],
  setTodoIdsWithLoader: () => {},
} as TodosContextProps);

type TodosContextProps = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  todoIdsWithLoader: number[],
  setTodoIdsWithLoader: React.Dispatch<React.SetStateAction<number[]>>,
};

type Props = {
  children: React.ReactNode,
};

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoIdsWithLoader, setTodoIdsWithLoader] = useState<number[]>([]);

  const initialValue = {
    todos,
    setTodos,
    todoIdsWithLoader,
    setTodoIdsWithLoader,
  };

  return (
    <TodosContext.Provider
      value={initialValue}
    >
      {children}
    </TodosContext.Provider>
  );
};
