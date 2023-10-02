import React, { useContext, useState } from 'react';
// import { useTodos } from './useTodos';
import { Todo } from '../types/Todo';

type TemporaryTodo = Omit<Todo, 'id'> | null;
type TodoContextValues = Omit<ReturnType<typeof useTodos>, 'isLoading'> & {
  userId: number;
  temporaryTodo: TemporaryTodo
  setTemporaryTodo: (todo: Omit<Todo, 'id'> | null) => void;
};

const TodoContext = React.createContext<TodoContextValues | undefined>(
  undefined,
);

type TodosProviderProps = {
  children: React.ReactNode;
  userId: number;
};

export const TodosProvider = ({ children, userId }: TodosProviderProps) => {
  // const { isLoading, ...rest } = useTodos(userId);
  const [temporaryTodo, setTemporaryTodo] = useState<TemporaryTodo>(
    null,
  );

  if (isLoading) {
    return <div>Loadding...</div>;
  }

  return (
    <TodoContext.Provider value={{
      ...rest, userId, temporaryTodo, setTemporaryTodo,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useToDoContext = () => {
  const values = useContext(TodoContext);

  if (!values) {
    throw new Error('TodoContext can be used only in TodosProvider');
  }

  return values;
};
