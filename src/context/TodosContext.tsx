import React, {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { temporaryTodo } from '../utils/tempTodo';
import { getTodos } from '../api/todos';
import { Errors } from '../types/Errors';
import { Todo } from '../types/Todo';

interface Props {
  children: React.ReactNode;
}

type Context = {
  todos: Todo[];
  setTodos: React.Dispatch<SetStateAction<Todo[]>>;
  errorMessage: Errors | null;
  setErrorMessage: React.Dispatch<SetStateAction<Errors | null>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<SetStateAction<Todo | null>>;
  loadingIds: number[];
  setLoadingIds: React.Dispatch<SetStateAction<number[]>>;
  createNewTodo: (title: string) => Todo;
};

const initialContextValue: Context = {
  todos: [],
  setTodos: () => {},
  errorMessage: null,
  setErrorMessage: () => {},
  tempTodo: temporaryTodo,
  setTempTodo: () => {},
  loadingIds: [],
  setLoadingIds: () => {},
  createNewTodo: title => ({ ...temporaryTodo, title: title }),
};

const TodosContext = createContext<Context>(initialContextValue);

export const TodosProvider: React.FunctionComponent<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage(Errors.loadingError))
      .finally(() => {});
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setErrorMessage(null);
      timeoutRef.current = null;
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [errorMessage]);

  function createNewTodo(currentTitle: string) {
    const newTodo: Todo = {
      ...temporaryTodo,
      title: currentTitle.trim(),
    };

    return newTodo;
  }

  const contextValues = {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    loadingIds,
    setLoadingIds,
    createNewTodo,
  };

  return (
    <TodosContext.Provider value={contextValues}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosContext = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('');
  }

  return context;
};
