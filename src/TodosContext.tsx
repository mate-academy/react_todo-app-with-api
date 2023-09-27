import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

interface TodosContextType {
  USER_ID: number;
  filteredTodos: Todo[],
  isAllTodosCompleted: boolean;
  isTitleFieldFocused: boolean;
  todos: Todo[],
  error: string;
  filter: Filter,
  tempTodos: Todo[];

  handlerTitleFieldFocused: (status: boolean) => void;
  handleToggleAllTodos: () => void;
  handleAddTodo: (title: string) => Promise<boolean | undefined>;
  handleUpdateTodo: (todo: Todo) => Promise<boolean>;
  handleDeleteTodo: (todo: Todo) => void;
  handleClearComplete: () => void;
  handleFilter: (value: Filter) => void;
  handleClearError: () => void;
}

enum ErrorsMessages {
  Clear = '',
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Update = 'Unable to update a todo',
  Empty = 'Title should not be empty',
  Delete = 'Unable to delete a todo',

}

type Props = {
  children: React.ReactNode,
};

const USER_ID = 11478;

export const TodosContext = createContext({} as TodosContextType);

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodos, setTempTodos] = useState<Todo[]>([] as Todo[]);
  const [isTitleFieldFocused, setIsTitleFieldFocused] = useState(true);
  const [error, setError] = useState('');

  const filteredTodos: Todo[] = useMemo(() => todos.filter(({ completed }) => {
    switch (filter) {
      case Filter.Active:
        return !completed;
      case Filter.Completed:
        return completed;
      default:
        return true;
    }
  }), [filter, todos, tempTodos]);

  const timerIdRef = useRef<number>(0);

  useEffect(() => {
    if (timerIdRef.current) {
      window.clearTimeout(timerIdRef.current);
    }

    timerIdRef.current = window.setTimeout(() => {
      setError(ErrorsMessages.Clear);
    }, 3000);

    return () => clearTimeout(timerIdRef.current);
  }, [error]);

  const loadTodos = async () => {
    try {
      setError(ErrorsMessages.Clear);
      const fetchedTodos = await getTodos(USER_ID);

      setTodos(fetchedTodos);
    } catch {
      setError(ErrorsMessages.Load);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handlerTitleFieldFocused = (status: boolean) => {
    setIsTitleFieldFocused(status);
  };

  const handleFilter = (value: Filter) => {
    setFilter(value);
  };

  const handleClearError = () => {
    setError(ErrorsMessages.Clear);
  };

  const isAllTodosCompleted = todos.every(todo => todo.completed);

  const handleToggleAllTodos = async () => {
    const updatedTodos = [...todos];
    const newStatus = { completed: false };

    if (!isAllTodosCompleted) {
      newStatus.completed = true;
    }

    const todosToRequest = !isAllTodosCompleted
      ? updatedTodos.filter(todo => !todo.completed)
      : updatedTodos;

    try {
      setError(ErrorsMessages.Clear);
      setTempTodos(todos);

      await Promise.all(todosToRequest.map(async (todo) => {
        const updatedTodo = await updateTodo(todo.id, newStatus) as Todo;
        const indexOfUpdatedTodo = updatedTodos
          .findIndex(({ id }) => id === updatedTodo.id);

        updatedTodos[indexOfUpdatedTodo].completed = updatedTodo.completed;
        setTodos(updatedTodos);
      }));
    } catch {
      setError(ErrorsMessages.Update);
    } finally {
      setTempTodos([]);
    }
  };

  const handleAddTodo = async (title: string): Promise<boolean | undefined> => {
    if (!title) {
      setError(ErrorsMessages.Empty);

      return false;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    try {
      setError(ErrorsMessages.Clear);
      setTempTodos([newTodo]);
      const responseAddedTodo = await addTodo(newTodo);
      const addedTodo = responseAddedTodo as Todo;

      setTodos(prevTodos => [...prevTodos, addedTodo]);

      return true;
    } catch {
      setError(ErrorsMessages.Add);

      return false;
    } finally {
      setTempTodos([]);
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    try {
      setError(ErrorsMessages.Clear);
      setTempTodos([todo]);
      const newTodo = {
        title: todo.title,
        completed: todo.completed,
      };
      const updatedTodoResponse = await updateTodo(todo.id, newTodo);
      const updatedTodo = updatedTodoResponse as Todo;
      const preperedUpdatedTodo = {
        id: updatedTodo.id,
        userId: updatedTodo.userId,
        title: updatedTodo.title,
        completed: updatedTodo.completed,
      };
      const indexOfUpdatedTodo = todos.findIndex(item => item.id === todo.id);
      const newTodos = [...todos];

      newTodos[indexOfUpdatedTodo] = preperedUpdatedTodo;

      setTodos(newTodos);

      return true;
    } catch {
      setError(ErrorsMessages.Update);

      return false;
    } finally {
      setTempTodos([]);
    }
  };

  const handleDeleteTodo = async (todo: Todo) => {
    try {
      setError(ErrorsMessages.Clear);
      setTempTodos([todo]);
      await deleteTodo(todo.id);
      setTodos(prevTodos => prevTodos.filter(item => item.id !== todo.id));
    } catch {
      setError(ErrorsMessages.Delete);
    } finally {
      setTempTodos([]);
    }
  };

  const completedTodos = todos.filter(({ completed }) => completed === true);

  const handleClearComplete = async () => {
    try {
      setError(ErrorsMessages.Clear);
      setTempTodos(completedTodos);
      await Promise.all(completedTodos.map(async (todo) => {
        await deleteTodo(todo.id);
        setTodos(prevTodos => prevTodos
          .filter(item => item.id !== todo.id));
      }));
    } catch {
      setError(ErrorsMessages.Delete);
    } finally {
      setTempTodos([]);
    }
  };

  const value = {
    todos,
    error,
    filter,
    filteredTodos,
    USER_ID,
    tempTodos,
    isAllTodosCompleted,
    isTitleFieldFocused,
    loadTodos,
    handleFilter,
    handlerTitleFieldFocused,
    handleToggleAllTodos,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    handleClearComplete,
    handleClearError,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  return useContext(TodosContext);
};