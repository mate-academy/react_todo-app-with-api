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
  isLoader: boolean;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorType>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setIsLoader: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodosContext = React.createContext<TodosContextType>({
  userId,
  todos: initialTodos,
  filter: FilterType.ALL,
  errorMessage: ErrorType.noError,
  tempTodo: null,
  isLoader: false,
  setTodos: () => {},
  setFilter: () => {},
  setErrorMessage: () => {},
  setTempTodo: () => {},
  setIsLoader: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorType.noError);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoader, setIsLoader] = useState(false);

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
    isLoader,
    setIsLoader,
  }), [todos, filter, errorMessage, tempTodo, isLoader]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
