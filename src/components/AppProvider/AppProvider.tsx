import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import { TEMP_TODO_ID, USER_ID } from '../../utils/constants';

interface AppContextType {
  selectedFilter: Filters;
  setSelectedFilter: (filter: Filters) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  tempTodo: Todo | null;
  addTempTodo: (todo: string) => Promise<void>;
  errorMessage: string;
  isNotificationVisible: boolean;
  setIsNotificationVisible: (hide: boolean) => void;
  isTodosLoading: boolean;
  todosToRemove: Todo[];
  setTodosToRemove: React.Dispatch<React.SetStateAction<Todo[]>>;
  todosToToggle: Todo[];
  setTodosToToggle: React.Dispatch<React.SetStateAction<Todo[]>>;
  changeTodo: (id: number, changes: Partial<Todo>) => Promise<void>;
  activeTodos: Todo[];
}

export const AppContext = createContext<AppContextType>(
  {
    selectedFilter: Filters.All,
    setSelectedFilter: () => {},
    todos: [],
    setTodos: () => {},
    tempTodo: null,
    addTempTodo: async () => {},
    errorMessage: '',
    isNotificationVisible: true,
    setIsNotificationVisible: () => {},
    isTodosLoading: false,
    todosToRemove: [],
    setTodosToRemove: () => {},
    todosToToggle: [],
    setTodosToToggle: () => {},
    changeTodo: async () => {},
    activeTodos: [],
  },
);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isTodosLoading, setIsTodosLoading] = useState(false);
  const [todosToRemove, setTodosToRemove] = useState<Todo[]>([]);
  const [todosToToggle, setTodosToToggle] = useState<Todo[]>([]);

  const showNotification = useCallback((message: string) => {
    setErrorMessage(message);
    setIsNotificationVisible(true);
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
      id: TEMP_TODO_ID,
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setErrorMessage('');
      setIsNotificationVisible(false);
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
      setIsNotificationVisible(false);
      const result = await getTodos(USER_ID);

      setTodos(result);
    } catch (err) {
      if (err instanceof Error) {
        showNotification(err.message);
      }
    } finally {
      setIsTodosLoading(false);
    }
  }, [setTodos]);

  useEffect(() => {
    if (todosToRemove.length) {
      Promise.all(todosToRemove.map(
        todo => removeTodoById(todo.id),
      ))
        .then(() => setTodosToRemove([]));
    }
  }, [todosToRemove]);

  useEffect(() => {
    if (todosToToggle.length) {
      Promise.all(todosToToggle
        .map(({ id, completed }) => changeTodo(id, { completed: !completed })))
        .then(() => setTodosToToggle([]));
    }
  }, [todosToToggle]);

  const activeTodos = useMemo(
    () => todos.filter(({ completed }) => !completed),
    [todos],
  );

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  return (
    <AppContext.Provider
      value={{
        todos,
        selectedFilter,
        setSelectedFilter,
        setTodos,
        tempTodo,
        addTempTodo,
        errorMessage,
        isNotificationVisible,
        setIsNotificationVisible,
        isTodosLoading,
        todosToRemove,
        setTodosToRemove,
        todosToToggle,
        setTodosToToggle,
        changeTodo,
        activeTodos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
