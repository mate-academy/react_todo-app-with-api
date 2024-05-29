import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Error, Filter, Todo, TodoContextType } from '../types';
import {
  deleteTodo,
  getTodos,
  postTodo,
  renameTodo,
  toggleTodoStatus,
} from '../api/todos';

const initialValue: Todo[] = [];

const TodosContext = createContext<TodoContextType>({
  todos: initialValue,
  setTodos: () => {},
  addTodo: () => {},
  removeTodo: () => {},
  updateTitle: () => {},
  toggleOne: () => {},
  toggleAll: () => {},
  filter: Filter.All,
  setFilter: () => {},
  query: '',
  setQuery: () => {},
  error: Error.NO_ERROR,
  setError: () => {},
  isLoading: false,
  setIsLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  loadingTodosIds: [],
  setLoadingTodosIds: () => {},
});

type Props = {
  children: ReactNode;
};

export const TodosProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(Error.NO_ERROR);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);
    setLoadingTodosIds(prev => [...prev, 0]);

    try {
      const res = await postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, res]);
      setQuery('');
    } catch {
      setError(Error.UNABLE_TO_ADD);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
      setLoadingTodosIds(prevTodos => prevTodos.filter(todoId => todoId !== 0));
    }
  };

  const removeTodo = async (id: number) => {
    setIsLoading(true);
    setLoadingTodosIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setError(Error.UNABLE_TO_DELETE);
    } finally {
      setIsLoading(false);
      setLoadingTodosIds(prevTodos =>
        prevTodos.filter(todoId => todoId !== id),
      );
    }
  };

  const changeTodoStatus = async (id: number, status: boolean) => {
    setIsLoading(true);
    setLoadingTodosIds(prev => [...prev, id]);

    const preparedForUpdate = todos.find(todo => todo.id === id);

    if (preparedForUpdate) {
      try {
        await toggleTodoStatus(id, status);
        setTodos(prevTodos =>
          prevTodos.map(prev =>
            prev.id === id ? { ...prev, completed: status } : prev,
          ),
        );
      } catch {
        setError(Error.UNABLE_TO_UPDATE);
      } finally {
        setIsLoading(false);
        setLoadingTodosIds(prev => prev.filter(todoId => todoId !== id));
      }
    }
  };

  const toggleOne = (id: number) => {
    const preparedForUpdate = todos.find(todo => todo.id === id);

    if (preparedForUpdate) {
      changeTodoStatus(id, !preparedForUpdate.completed);
    }
  };

  const toggleAll = (status: boolean) => {
    todos.forEach(({ id, completed }) => {
      if (completed !== status) {
        changeTodoStatus(id, status);
      }
    });
  };

  const updateTitle = async (
    id: number,
    newTitle: string,
    setEditTodoId: (id: number | null) => {},
  ) => {
    setIsLoading(true);
    setLoadingTodosIds(prev => [...prev, id]);

    try {
      await renameTodo(id, newTitle);
      setTodos(prevTodos =>
        prevTodos.map(prev =>
          prev.id === id ? { ...prev, title: newTitle } : prev,
        ),
      );
      setEditTodoId(null);
    } catch {
      setError(Error.UNABLE_TO_UPDATE);
    } finally {
      setIsLoading(false);
      setLoadingTodosIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setError(Error.UNABLE_TO_LOAD);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        addTodo,
        removeTodo,
        updateTitle,
        toggleOne,
        toggleAll,
        filter,
        setFilter,
        query,
        setQuery,
        error,
        setError,
        isLoading,
        setIsLoading,
        tempTodo,
        setTempTodo,
        loadingTodosIds,
        setLoadingTodosIds,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
