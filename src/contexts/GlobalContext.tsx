import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { addTodos, getTodos } from '../api/todos';
import { AuthContext } from '../components/Auth/AuthContext';
import { Todo } from '../types/Todo';

interface ContextType {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  noError: boolean,
  setNoError: React.Dispatch<React.SetStateAction<boolean>>,
  errorText: string,
  setErrorText: React.Dispatch<React.SetStateAction<string>>,
  filterStatus: string,
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>,
  isAdding: boolean,
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>,
  isLoading: number[],
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>,
  temporaryTodo: Todo | null,
  setTemporaryTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  showError: (errorTextToShow: string) => void,
  onTitleSubmit: (title: string) => void,
  visibleTodos: Todo[],
}

export const GlobalContext = createContext<ContextType>({
  todos: [],
  setTodos: () => { },
  noError: true,
  setNoError: () => { },
  errorText: '',
  setErrorText: () => { },
  filterStatus: 'All',
  setFilterStatus: () => { },
  isAdding: false,
  setIsAdding: () => { },
  isLoading: [0],
  setIsLoading: () => { },
  temporaryTodo: null,
  setTemporaryTodo: () => { },
  showError: () => { },
  onTitleSubmit: () => { },
  visibleTodos: [],
});

type Props = {
  children: JSX.Element,
};

export const GlobalProvider: FC<Props> = ({ children }) => {
  const user = useContext(AuthContext);
  const userId = user ? user.id : 0;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [noError, setNoError] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState([0]);
  const [
    temporaryTodo,
    setTemporaryTodo,
  ] = useState<Todo | null>(null);

  const showError = (errorTextToShow: string) => {
    setNoError(false);
    setErrorText(errorTextToShow);

    setTimeout(() => {
      setNoError(true);
      setErrorText('');
    }, 3000);
  };

  useEffect(() => {
    getTodos(userId)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        showError('Unable to update a todo');
      });
  }, []);

  const onTitleSubmit = useCallback((title: string) => {
    const trimedTitle = title.trim();

    if (trimedTitle.length === 0) {
      showError('Title can\'t be empty');

      return;
    }

    setTemporaryTodo({
      id: 0,
      userId,
      title: trimedTitle,
      completed: false,
    });

    setIsAdding(true);

    const newTodo = {
      userId,
      title: trimedTitle,
      completed: false,
    };

    addTodos(userId, newTodo)
      .then((newTodoFromServer) => {
        setTodos((currentTodos) => {
          return [...currentTodos, newTodoFromServer];
        });
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setTemporaryTodo(null);
        setIsAdding(false);
      });
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (filterStatus) {
        case 'Active':
          return !completed;
        case 'Completed':
          return completed;
        default:
          return true;
      }
    });
  }, [todos, filterStatus]);

  const memoDependencies = [
    todos,
    noError,
    errorText,
    filterStatus,
    isAdding,
    isLoading,
    temporaryTodo,
    visibleTodos,
  ];

  const contextValue: ContextType = useMemo(() => {
    return {
      todos,
      setTodos,
      noError,
      setNoError,
      errorText,
      setErrorText,
      filterStatus,
      setFilterStatus,
      isAdding,
      setIsAdding,
      isLoading,
      setIsLoading,
      temporaryTodo,
      setTemporaryTodo,
      showError,
      onTitleSubmit,
      visibleTodos,
    };
  }, memoDependencies);

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
