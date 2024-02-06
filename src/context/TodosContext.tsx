import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ErrorType, FilterType, Todo } from '../types';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from '../api/todos';
import { useAuthContext } from './AuthContext';

type Props = {
  children: ReactNode;
};

type TodoProviderType = {
  loadingTodos: number[];
  setLoadingTodos: (loadingTodos: number[]) => void
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  errors: ErrorType | null;
  setErrors: (error: ErrorType | null) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo) => void;
  filteredTodos: Todo[];
  inProgress: number;
  deleteTodoFromServer: (todoId: number) => void;
  deleteCompletedTodos: () => void;
  addTodoToServer: (todo: Omit<Todo, 'id'>) => Promise<boolean>;
  updateTodoOnServer: (id:number, todo: Partial<Todo>) => Promise<void>;
  updateAllTodoOnServer: (status: boolean) => Promise<void>;
};

const TodoContext = createContext<TodoProviderType>({
  loadingTodos: [],
  setLoadingTodos: () => [],
  todos: [],
  setTodos: () => {},
  errors: null,
  setErrors: () => {},
  filter: FilterType.All,
  setFilter: () => {},
  filteredTodos: [],
  tempTodo: null,
  setTempTodo: () => {},
  inProgress: 0,
  deleteTodoFromServer: () => {},
  deleteCompletedTodos: () => {},
  addTodoToServer: async () => false,
  updateTodoOnServer: async () => {},
  updateAllTodoOnServer: async () => {},
});

export const TodosProvider: FC<Props> = ({ children }) => {
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState<ErrorType | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const userId = useAuthContext();

  const addLoadingTodo = (todoId: number) => {
    setLoadingTodos(prevState => [...prevState, todoId]);
  };

  const removeLoadingTodo = (todoId: number) => {
    setLoadingTodos(prevState => prevState.filter(
      loadingTodosId => loadingTodosId !== todoId,
    ));
  };

  const deleteTodoFromServer = async (todoId: number) => {
    setErrors(null);
    addLoadingTodo(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch (error) {
      setErrors(ErrorType.DELETE);
    } finally {
      removeLoadingTodo(todoId);
    }
  };

  const deleteCompletedTodos = async () => {
    setErrors(null);
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      const queueOfTodosForDelete = completedTodos
        .map(todo => {
          return deleteTodoFromServer(todo.id);
        });

      await Promise.allSettled(queueOfTodosForDelete);
    } catch (error) {
      setErrors(ErrorType.DELETE);
    }
  };

  const addTodoToServer = async (newTodo: Omit<Todo, 'id'>) => {
    setErrors(null);
    try {
      addLoadingTodo(0);
      setTempTodo({ id: 0, ...newTodo });
      const data = await addTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, data]);

      return true;
    } catch (error) {
      setErrors(ErrorType.ADD);

      return false;
    } finally {
      setTempTodo(null);
      removeLoadingTodo(0);
    }
  };

  const updateTodoOnServer = async (
    todoId: number, editParams: Partial<Todo>,
  ) => {
    setErrors(null);
    addLoadingTodo(todoId);
    try {
      const data:Todo = await updateTodo(todoId, editParams);

      setTodos(currentTodos => currentTodos.map(todo => (
        todo.id === todoId
          ? data
          : todo
      )));
    } catch (error) {
      setErrors(ErrorType.UPDATE);
    } finally {
      removeLoadingTodo(todoId);
    }
  };

  const updateAllTodoOnServer = async (status: boolean) => {
    setErrors(null);
    try {
      const activeTodos = todos.filter(todo => !todo.completed);

      if (activeTodos.length) {
        const queueOfTodosForCompleted = activeTodos
          .map(todo => (
            updateTodoOnServer(todo.id, { completed: status })
          ));

        await Promise.all(queueOfTodosForCompleted);
      } else {
        const completedTodos = todos.filter(todo => todo.completed);
        const queueOfTodosForActivate = completedTodos
          .map(todo => (
            updateTodoOnServer(todo.id, { completed: !status })
          ));

        await Promise.all(queueOfTodosForActivate);
      }
    } catch (error) {
      setErrors(ErrorType.DELETE);
    }
  };

  useEffect(() => {
    setErrors(null);
    const fetchData = async () => {
      try {
        const data = await getTodos(userId);

        setTodos(data);
      } catch (er) {
        setErrors(ErrorType.LOAD);
      }
    };

    fetchData();
  }, [userId]);

  const filteredTodos = useMemo(() => {
    return todos
      .filter(todo => {
        switch (filter) {
          case FilterType.Active:
            return !todo.completed;
          case FilterType.Completed:
            return todo.completed;
          default:
            return true;
        }
      });
  }, [filter, todos]);

  const inProgress = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const value = {
    loadingTodos,
    setLoadingTodos,
    todos,
    setTodos,
    errors,
    setErrors,
    filter,
    setFilter,
    filteredTodos,
    tempTodo,
    setTempTodo,
    inProgress,
    deleteTodoFromServer,
    deleteCompletedTodos,
    addTodoToServer,
    updateTodoOnServer,
    updateAllTodoOnServer,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
