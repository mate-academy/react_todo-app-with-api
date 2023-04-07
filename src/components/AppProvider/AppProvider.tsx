import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Filters } from '../../types/enums';
import { Todo } from '../../types/Todo';
import {
  addTodo,
  getTodos,
  patchTodo,
  removeTodo,
} from '../../api/todos';
import { USER_ID } from '../../utils/constants';

interface AppContextType {
  selectedFilter: Filters;
  setSelectedFilter: (filter: Filters) => void;
  todos: Todo[];
  updateTodos: (todos: Todo[]) => void;
  tempTodo: Todo | null;
  addTempTodo: (todo: string) => Promise<void>;
  errorMessage: string;
  hideNotification: boolean;
  setHideNotification: (hide: boolean) => void;
  isTodosLoading: boolean;
  arrayOfTodosToRemove: Todo[];
  setArrayOfTodosToRemove: React.Dispatch<React.SetStateAction<Todo[]>>;
  arrayOfTodosToToggle: Todo[];
  setArrayOfTodosToToggle: React.Dispatch<React.SetStateAction<Todo[]>>;
  changeTodo: (id: number, changes: Partial<Todo>) => Promise<void>;
}

export const AppContext = createContext<AppContextType>(
  {
    selectedFilter: Filters.All,
    setSelectedFilter: () => {},
    todos: [],
    updateTodos: () => {},
    tempTodo: null,
    addTempTodo: async () => {},
    errorMessage: '',
    hideNotification: true,
    setHideNotification: () => {},
    isTodosLoading: false,
    arrayOfTodosToRemove: [],
    setArrayOfTodosToRemove: () => {},
    arrayOfTodosToToggle: [],
    setArrayOfTodosToToggle: () => {},
    changeTodo: async () => {},
  },
);

export const useAppContext = () => useContext(AppContext);

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [hideNotification, setHideNotification] = useState(true);
  const [isTodosLoading, setIsTodosLoading] = useState(false);
  const [arrayOfTodosToRemove, setArrayOfTodosToRemove] = useState<Todo[]>([]);
  const [arrayOfTodosToToggle, setArrayOfTodosToToggle]
    = useState<Todo[]>([]);

  const updateTodos = useCallback((newTodos: Todo[]) => {
    setTodos(newTodos);
  }, []);

  const showNotification = useCallback((message: string) => {
    setErrorMessage(message);
    setHideNotification(false);
  }, []);

  const changeTodo = useCallback(async (id: number, changes: Partial<Todo>) => {
    try {
      const changedTodo = await patchTodo(id, changes);

      setTodos(
        prevTodos => prevTodos.map(
          todo => (todo.id === id ? changedTodo : todo),
        ),
      );
    } catch {
      showNotification('Unable to update a todo');
    }
  }, []);

  const addTempTodo = useCallback(async (title: string) => {
    const todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setErrorMessage('');
      setHideNotification(true);
      setTempTodo(todo);
      const newTodo = await addTodo(todo);

      setTodos(prevTodos => ([
        ...prevTodos,
        newTodo,
      ]));
    } catch {
      showNotification('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodoById = useCallback(async (id: number) => {
    try {
      await removeTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      showNotification('Unable to delete a todo');
    }
  }, []);

  const loadTodosFromServer = useCallback(async () => {
    try {
      setIsTodosLoading(true);
      setErrorMessage('');
      setHideNotification(true);
      const result = await getTodos(USER_ID);

      updateTodos(result);
    } catch (err) {
      if (err instanceof Error) {
        showNotification(err.message);
      }
    } finally {
      setIsTodosLoading(false);
    }
  }, [updateTodos]);

  useEffect(() => {
    if (arrayOfTodosToRemove.length) {
      Promise.all(arrayOfTodosToRemove.map(
        todo => removeTodoById(todo.id),
      ))
        .then(() => setArrayOfTodosToRemove([]));
    }
  }, [arrayOfTodosToRemove]);

  useEffect(() => {
    if (arrayOfTodosToToggle.length) {
      Promise.all(arrayOfTodosToToggle
        .map(({ id, completed }) => changeTodo(id, { completed: !completed })))
        .then(() => setArrayOfTodosToToggle([]));
    }
  }, [arrayOfTodosToToggle]);

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  return (
    <AppContext.Provider
      value={{
        todos,
        selectedFilter,
        setSelectedFilter,
        updateTodos,
        tempTodo,
        addTempTodo,
        errorMessage,
        hideNotification,
        setHideNotification,
        isTodosLoading,
        arrayOfTodosToRemove,
        setArrayOfTodosToRemove,
        arrayOfTodosToToggle,
        setArrayOfTodosToToggle,
        changeTodo,
      }}
    >
      { children }
    </AppContext.Provider>
  );
};
