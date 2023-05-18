import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface TodoContextType {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  todoIdsInUpdating: number[];
  setTodoIdsInUpdating: Dispatch<SetStateAction<number[]>>;
  filter: Filter;
  setStatus: Dispatch<SetStateAction<Filter>>;
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
  setStatus: () => {},
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
  const [status, setStatus] = useState<Filter>(Filter.ALL);

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        todoIdsInUpdating,
        setTodoIdsInUpdating,
        tempTodo,
        setTempTodo,
        error,
        setError,
        filter: status,
        setStatus,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
