import
React,
{
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';

const initialTodos: Todo[] = [];
const userId = 11973;

type TodosContextType = {
  userId: number;
  todos: Todo[];
  filter: FilterType;
  errorMessage: ErrorType;
  tempTodo: Todo | null;
  loadingTodoId: number[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorType>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodosContext = React.createContext<TodosContextType>({
  userId,
  todos: initialTodos,
  filter: FilterType.ALL,
  errorMessage: ErrorType.noError,
  tempTodo: null,
  loadingTodoId: [],
  setTodos: () => { },
  setFilter: () => { },
  setErrorMessage: () => { },
  setTempTodo: () => { },
  setLoadingTodoId: () => { },
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorType.noError);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  function loadTodos() {
    getTodos(userId)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorType.loadError))
      .finally(() => {
        setTimeout(() => setErrorMessage(ErrorType.noError), 3000);
      });
  }

  useEffect(loadTodos, []);

  const value = useMemo(() => ({
    userId,
    todos,
    setTodos,
    filter,
    setFilter,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    loadingTodoId,
    setLoadingTodoId,
  }), [todos, filter, errorMessage, tempTodo, loadingTodoId]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
