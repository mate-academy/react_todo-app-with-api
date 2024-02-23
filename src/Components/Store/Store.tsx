import React, {
  MutableRefObject,
  SetStateAction,
  useCallback,
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
  deleteTodo: (todoId: number) => void;
  // updateTodo: (updatedTodo: Todo) => Promise<void>;
  updateTodo: (updatedTodo: Todo) => void;
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
  deleteTodo: () => {},
  // updateTodo: () => Promise.resolve(),
  updateTodo: () => {},
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

  const deleteTodo = useCallback(async (todoId: number) => {
    setErrorMessage('');
    addProcessing(todoId);

    return client
      .delete(`/${todoId}`)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        removeProcessing(todoId);
        focus.current?.focus();
      });
  }, []);

  const updateTodo = useCallback(async (updatedTodo: Todo) => {
    setErrorMessage('');
    addProcessing(updatedTodo.id);

    return client
      .patch(`/${updatedTodo.id}`, updatedTodo)
      .then(() => {
        setTodos(current =>
          current.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => removeProcessing(updatedTodo.id));
  }, []);

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
      deleteTodo,
      updateTodo,
    }),
    [
      todos,
      errorMessage,
      filter,
      tempItem,
      creating,
      isProcessing,
      deleteTodo,
      updateTodo,
    ],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
