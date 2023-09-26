import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/TodoStatus';
import { filterBy } from '../utils/filterBy';
import {
  INVALID_TITLE_ERROR_MESSAGE,
  DOWNLOAD_ERROR_MESSAGE,
  ADD_TODO_ERROR_MESSAGE,
  DELETE_TODO_ERROR_MESSAGE,
  UPDATE_TODO_ERROR_MESSAGE,
  USER_ID,
} from '../utils/constants';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { TodoUpdateData } from '../types/TodoUpdateData';

interface TodosContextType {
  todos: Todo[];

  filterType: FilterType;

  tempTodo: Todo | null;

  todosIdsUpdating: number[];

  errorMessage: ErrorType | null;

  isInputFocused: boolean;

  visibleTodos: Todo[];

  handleFilterChange: (type: FilterType) => void;
  handleAddTodo: (
    title: string
  ) => Promise<boolean>;
  handleChangeTodo: (todoId: number, data: TodoUpdateData) => void;
  handleDeleteTodo: (...ids: number[]) => void;
  handleDeleteCompletedTodo: () => void;
  handleToggleAllTodo: () => void,
}

const initialTodosState: TodosContextType = {
  todos: [],
  filterType: FilterType.All,
  tempTodo: null,
  todosIdsUpdating: [],
  errorMessage: null,
  isInputFocused: true,
  visibleTodos: [],
  handleFilterChange: () => {},
  handleAddTodo: () => Promise.resolve(false),
  handleChangeTodo: () => {},
  handleDeleteTodo: () => {},
  handleDeleteCompletedTodo: () => {},
  handleToggleAllTodo: () => {},
};

export const TodosContext = createContext<TodosContextType>(initialTodosState);

interface Props {
  children: React.ReactNode
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosIdsUpdating, setTodosIdsUpdating] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(true);

  const setError = (message: string) => {
    setErrorMessage({ message });
  };

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        const response = await getTodos(USER_ID);

        setTodos(response);
      } catch {
        setError(DOWNLOAD_ERROR_MESSAGE);
      }
    };

    getTodosFromServer();
  }, []);

  const visibleTodos = useMemo(() => {
    return filterBy(todos, filterType);
  }, [filterType, todos]);

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
  };

  const handleAddTodo = async (
    title: string,
  ): Promise<boolean> => {
    setErrorMessage(null);
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError(INVALID_TITLE_ERROR_MESSAGE);

      return false;
    }

    const tempTodoData: Todo = {
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
      createdAt: '',
      updatedAt: '',
    };
    const addTodoPromise = addTodo(tempTodoData);

    try {
      setTempTodo(tempTodoData);
      setTodosIdsUpdating(prevState => [...prevState, tempTodoData.id]);

      const response = await addTodoPromise;
      const updatedTodo = { ...tempTodoData, id: response.id };

      setTodos(prevTodos => [...prevTodos, updatedTodo]);

      return true;
    } catch {
      setError(ADD_TODO_ERROR_MESSAGE);

      return false;
    } finally {
      setIsInputFocused(true);
      setTempTodo(null);
      setTodosIdsUpdating(
        prevState => prevState.filter(id => id !== tempTodoData.id),
      );
    }
  };

  const handleChangeTodo = async (id: number, data: TodoUpdateData) => {
    setErrorMessage(null);
    setTodosIdsUpdating(prevState => [...prevState, id]);

    try {
      const updatedTodo = await updateTodo(id, data);

      setTodos(currentTodos => {
        const index = currentTodos.findIndex(todo => todo.id === id);
        const updatedTodos = [...currentTodos];

        updatedTodos.splice(index, 1, updatedTodo);

        return updatedTodos;
      });
    } catch {
      setError(UPDATE_TODO_ERROR_MESSAGE);
      throw new Error(UPDATE_TODO_ERROR_MESSAGE);
    } finally {
      setIsInputFocused(false);
      setTodosIdsUpdating(
        prevState => prevState.filter(idLoading => idLoading !== id),
      );
    }
  };

  const handleToggleAllTodo = () => {
    const todosToChange = todos.some(todo => !todo.completed)
      ? filterBy(todos, FilterType.Active)
      : todos;

    todosToChange.forEach(todo => {
      const { id, completed } = todo;

      handleChangeTodo(id, { completed: !completed });
    });
  };

  const handleDeleteTodo = async (id: number) => {
    setErrorMessage(null);
    setTodosIdsUpdating((prevState) => [...prevState, id]);

    try {
      await deleteTodo(id);
      setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
    } catch {
      setError(DELETE_TODO_ERROR_MESSAGE);
    } finally {
      setTodosIdsUpdating(
        (prevState) => prevState.filter(loadingId => loadingId !== id),
      );
    }
  };

  const handleDeleteCompletedTodo = async () => {
    const completedTodosId = todos.reduce((acc: number[], todo) => {
      if (todo.completed) {
        acc.push(todo.id);
      }

      return acc;
    }, []);

    completedTodosId.forEach(id => {
      handleDeleteTodo(id);
    });
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        filterType,
        tempTodo,
        todosIdsUpdating,
        errorMessage,
        visibleTodos,
        handleFilterChange,
        handleAddTodo,
        handleChangeTodo,
        handleDeleteTodo,
        handleDeleteCompletedTodo,
        handleToggleAllTodo,
        isInputFocused,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
