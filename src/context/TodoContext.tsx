import {
  createContext,
  useContext,
  useState,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
} from 'react';

import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface TodoContextType {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  tempTodo: Todo | null,
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

const TodoContext = createContext<TodoContextType>({
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  filter: Filter.ALL,
  setFilter: () => {},
  error: null,
  setError: () => {},
});

export const useTodoContext = () => useContext(TodoContext);

export const TodoContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);

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
