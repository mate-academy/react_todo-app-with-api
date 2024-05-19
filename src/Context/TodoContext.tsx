import { createContext, useState, useEffect, useRef } from 'react';
import { getTodos } from '../api/todos';

import { Todo } from '../types/Todo';
import { Error } from '../types/Error';
import { filterTodosByStatus } from '../Helpers/TodoHelpers';

type TodoContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  error: Error | '';
  setError: React.Dispatch<React.SetStateAction<Error | ''>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  headerInputRef: React.RefObject<HTMLInputElement>;
  focusInput: () => void;
  deleteTodoLocal: (id: number) => void;
  visibleTodos: Todo[];
  updateTodoLocal: (updatedTodo: Todo) => void;
};

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  setTodos: () => {},
  error: '',
  setError: () => {},
  status: 'all',
  setStatus: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  headerInputRef: { current: null },
  focusInput: () => {},
  deleteTodoLocal: () => {},
  updateTodoLocal: () => {},
  visibleTodos: [],
});

type TodoProviderProps = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | ''>('');
  const [status, setStatus] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const headerInputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (headerInputRef.current) {
      headerInputRef.current.focus();
    }
  };

  const deleteTodoLocal = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const updateTodoLocal = (updatedTodo: Todo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
    );
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(Error.LoadTodos);
      });
  }, []);

  const visibleTodos = filterTodosByStatus(todos, status);

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        error,
        setError,
        status,
        setStatus,
        tempTodo,
        setTempTodo,
        headerInputRef,
        focusInput,
        deleteTodoLocal,
        visibleTodos,
        updateTodoLocal,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
