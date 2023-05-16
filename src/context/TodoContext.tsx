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
  todoIdsInUpdating: number[];
  setTodoIdsInUpdating: Dispatch<SetStateAction<number[]>>;
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
  todoIdsInUpdating: [],
  setTodoIdsInUpdating: () => {},
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
  const [todoIdsInUpdating, setTodoIdsInUpdating] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        tempTodo,
        setTempTodo,
        todoIdsInUpdating,
        setTodoIdsInUpdating,
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
