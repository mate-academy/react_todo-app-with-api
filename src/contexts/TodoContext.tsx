import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from 'react';
import { Todo } from '../types/Todo';
import { Sorting } from '../types/Sorting';

interface TodoContextProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filter: Sorting;
  setFilter: (filter: Sorting) => void;
  error: string | null;
  setError: (error: string | null) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  setTodos: () => {},
  filter: Sorting.All,
  setFilter: () => {},
  error: null,
  setError: () => {},
  tempTodo: null,
  setTempTodo: () => {},
});

export const useTodoContext = () => useContext(TodoContext);

export const TodoContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Sorting>(Sorting.All);

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        tempTodo,
        setTempTodo,
        error,
        setError,
        filter,
        setFilter,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
