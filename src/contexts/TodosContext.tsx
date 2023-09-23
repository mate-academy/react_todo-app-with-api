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
  UNABLE_ADD_ERROR_MESSAGE,
  UNABLE_DELETE_ERROR_MESSAGE,
  UNABLE_DOWNLOAD_ERROR_MESSAGE,
  UNABLE_UPDATE_ERROR_MESSAGE,
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
  setTodos: (todos: Todo[]) => void;

  filterType: FilterType;
  setFilterType: (filterType: FilterType) => void;

  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;

  todosIdsUpdating: number[];
  setTodosIdsUpdating: (ids: number[]) => void;

  errorMessage: ErrorType | null;
  setErrorMessage: (error: ErrorType) => void;

  visibleTodos: Todo[];

  handleFilterChange: (type: FilterType) => void;
  handleAddTodo: (
    title: string
  ) => Promise<boolean>;
  handleChangeTodo: (todoId: number, data: TodoUpdateData) => void;
  handleDeleteTodo: (...ids: number[]) => void;
  handleDeleteCompletedTodo: () => void;
  handleToogleTodo: () => void,
}

const initialTodosState: TodosContextType = {
  todos: [],
  setTodos: () => {},
  filterType: FilterType.All,
  setFilterType: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  todosIdsUpdating: [],
  setTodosIdsUpdating: () => {},
  errorMessage: null,
  setErrorMessage: () => {},
  visibleTodos: [],
  handleFilterChange: () => {},
  handleAddTodo: () => Promise.resolve(false),
  handleChangeTodo: () => {},
  handleDeleteTodo: () => {},
  handleDeleteCompletedTodo: () => {},
  handleToogleTodo: () => {},
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

  const setError = (message: string) => {
    setErrorMessage({ message });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(UNABLE_DOWNLOAD_ERROR_MESSAGE));
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
      setTodosIdsUpdating([tempTodoData.id]);

      const response = await addTodoPromise;
      const updatedTodo = { ...tempTodoData, id: response.id };

      setTodos(prevTodos => [...prevTodos, updatedTodo]);

      return true;
    } catch {
      setError(UNABLE_ADD_ERROR_MESSAGE);

      return false;
    } finally {
      setTempTodo(null);
      setTodosIdsUpdating([]);
    }
  };

  const handleChangeTodo = async (id: number, data: TodoUpdateData) => {
    setErrorMessage(null);
    setTodosIdsUpdating([id]);

    const originalTodo = todos.find(todo => todo.id === id) as Todo;

    setTodos(currentTodos => {
      const index = currentTodos.findIndex(todo => todo.id === id);
      const updatedTodos = [...currentTodos];

      const updatedTodo = { ...originalTodo, ...data };

      updatedTodos.splice(index, 1, updatedTodo);

      return updatedTodos;
    });

    try {
      await updateTodo(id, data);
    } catch {
      setTodos(currentTodos => {
        const index = currentTodos.findIndex(todo => todo.id === id);
        const revertedTodos = [...currentTodos];

        revertedTodos.splice(index, 1, originalTodo);

        return revertedTodos;
      });

      setError(UNABLE_UPDATE_ERROR_MESSAGE);
    } finally {
      setTodosIdsUpdating([]);
    }
  };

  const handleToogleTodo = async () => {
    const todosToChange = todos.some(todo => !todo.completed)
      ? filterBy(todos, FilterType.Active)
      : todos;
    const todosId = todosToChange.map(todo => todo.id);

    setTodosIdsUpdating(todosId);

    const changePromises = todosToChange
      .map((todo) => updateTodo(todo.id, { completed: !todo.completed }));

    const changedTodos = await Promise.all(changePromises);

    setTodos((prevState) => {
      return prevState.map((todo) => {
        const changed = changedTodos
          .find(changedTodo => changedTodo.id === todo.id);

        if (changed) {
          return changed;
        }

        return todo;
      });
    });

    if (changedTodos.length !== todosToChange.length) {
      setError(UNABLE_UPDATE_ERROR_MESSAGE);
    }

    setTodosIdsUpdating([]);
  };

  const handleDeleteTodo = async (id: number) => {
    setTodosIdsUpdating([id]);

    try {
      await deleteTodo(id);
      setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
    } catch {
      setError(UNABLE_DELETE_ERROR_MESSAGE);
    } finally {
      setTodosIdsUpdating([]);
    }
  };

  const handleDeleteCompletedTodo = async () => {
    setErrorMessage(null);
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setTodosIdsUpdating(completedTodosId);

    const deletePromises = completedTodosId.map(async (id) => {
      try {
        await deleteTodo(id);

        return id;
      } catch {
        return null;
      }
    });

    const deletedIds = await Promise.all(deletePromises);

    setTodos(
      prevState => prevState.filter(todo => !deletedIds.includes(todo.id)),
    );

    setTodosIdsUpdating([]);
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        filterType,
        setFilterType,
        tempTodo,
        setTempTodo,
        todosIdsUpdating,
        setTodosIdsUpdating,
        errorMessage,
        setErrorMessage,
        visibleTodos,
        handleFilterChange,
        handleAddTodo,
        handleChangeTodo,
        handleDeleteTodo,
        handleDeleteCompletedTodo,
        handleToogleTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
