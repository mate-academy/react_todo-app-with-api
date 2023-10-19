import React, { useContext, useState } from 'react';
import { useTodos } from './useTodos';
import { Todo } from '../types/Todo';
import { Filter } from '../components/ToDoFooter/types';
import { ErrorMessage } from '../types/Error';

type TemporaryTodo = Omit<Todo, 'id'> | null;
type TodoContextValues = Omit<ReturnType<typeof useTodos>, 'isLoading'> & {
  userId: number;
  temporaryTodo: TemporaryTodo;
  errorMessage: ErrorMessage;
  setTemporaryTodo: (todo: Omit<Todo, 'id'> | null) => void;
  showError: (message:ErrorMessage) => void;
  setTodoFilter: (filter:Filter) => void;
};

const TodoContext = React.createContext<TodoContextValues | undefined>(
  undefined,
);

type TodosProviderProps = {
  children: React.ReactNode;
  userId: number;
};

export const TodosProvider = ({ children, userId }: TodosProviderProps) => {
  const [errorMessage, showError] = useState<ErrorMessage>(ErrorMessage.none);
  const { ...rest } = useTodos(userId, () => showError(ErrorMessage.load));

  const [temporaryTodo, setTemporaryTodo] = useState<TemporaryTodo>(
    null,
  );

  return (
    <TodoContext.Provider value={{
      ...rest,
      userId,
      temporaryTodo,
      setTemporaryTodo,
      errorMessage,
      showError,
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
