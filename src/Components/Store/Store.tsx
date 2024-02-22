import React, {
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../Types/Todo';
import { client } from '../../utils/fetchClient';
import { FilterParams } from '../../Types/FilterParams';

export const USERS_URL = '?userId=';

export const USER_ID = 50;

type TodosContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<SetStateAction<Todo[]>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<string>;
  filter: FilterParams;
  setFilter: React.Dispatch<FilterParams>;
  tempItem: Todo | null;
  setTempItem: React.Dispatch<Todo | null>;
  creating: boolean;
  setCreating: React.Dispatch<boolean>;
  isProcessing: number[];
  addProcessing: (id: number) => void;
  removeProcessing: (idToRemove: number) => void;
  focus: MutableRefObject<HTMLInputElement | null>;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  filter: FilterParams.All,
  setFilter: () => {},
  tempItem: null,
  setTempItem: () => {},
  creating: false,
  setCreating: () => {},
  isProcessing: [],
  addProcessing: () => {},
  removeProcessing: () => {},
  focus: null as unknown as React.MutableRefObject<HTMLInputElement | null>,
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<FilterParams>(FilterParams.All);
  const [tempItem, setTempItem] = useState<Todo | null>(null);
  const [creating, setCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState<number[]>([]);
  const focus = useRef<HTMLInputElement>(null);

  function loadTodos() {
    client
      .get<Todo[]>(USERS_URL + USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {});
  }

  useEffect(loadTodos, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (errorMessage) {
      timerId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  const addProcessing = (id: number) => {
    setIsProcessing(current => [...current, id]);
  };

  const removeProcessing = (idToRemove: number) => {
    setIsProcessing(current => current.filter(id => id !== idToRemove));
  };

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      errorMessage,
      setErrorMessage,
      filter,
      setFilter,
      tempItem,
      setTempItem,
      creating,
      setCreating,
      isProcessing,
      addProcessing,
      removeProcessing,
      focus,
    }),
    [todos, errorMessage, filter, tempItem, creating, isProcessing],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
