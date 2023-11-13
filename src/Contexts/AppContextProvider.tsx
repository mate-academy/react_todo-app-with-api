import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const AppContext = createContext<AppContextType | null>(null);
export const USER_ID = 11688;

type Props = {
  children: React.ReactNode;
};

export type AppContextType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  queryCondition: QueryCondition;
  setQueryCondition: React.Dispatch<React.SetStateAction<QueryCondition>>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  visibleTodos: Todo[];
  setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement>;
  activeItems: number;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

type QueryCondition = 'all' | 'completed' | 'active';

export enum Filter {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [queryCondition, setQueryCondition] = useState<QueryCondition>('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeItems = todos.filter((todo) => !todo.completed).length;

  useEffect(() => {
    switch (queryCondition) {
      case Filter.completed:
        setVisibleTodos(todos.filter((todo) => todo.completed));
        break;
      case Filter.active:
        setVisibleTodos(todos.filter((todo) => !todo.completed));
        break;
      default:
        setVisibleTodos(todos);
    }
  }, [queryCondition, setVisibleTodos, todos]);

  const initialLoad = useCallback(async () => {
    try {
      const response = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

      setTodos(response);
      setVisibleTodos(response);
    } catch {
      setErrorMessage('Unable to load todos');
    }
  }, [setErrorMessage, setTodos, setVisibleTodos]);

  useEffect(() => {
    initialLoad();
    inputRef.current?.focus();
  }, [initialLoad]);

  const states: AppContextType = {
    query,
    setQuery,
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    queryCondition,
    setQueryCondition,
    visibleTodos,
    setVisibleTodos,
    isFetching,
    setIsFetching,
    inputRef,
    activeItems,
    tempTodo,
    setTempTodo,
  };

  return <AppContext.Provider value={states}>{children}</AppContext.Provider>;
};
