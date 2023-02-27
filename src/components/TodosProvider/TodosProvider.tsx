import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../../api/todos';

import { ErrorMessage } from '../../types/ErrorMessage';
import { FilterTypes } from '../../types/FIlterTypes';
import { Todo, UpdateData } from '../../types/Todo';
import { getFilteredTodos } from '../../utils/getFilteredTodos';

const USER_ID = 6359;

export type ContextType = {
  todos: Todo[],
  tempTodo: Todo | null,
  processedTodos: Todo[],
  activeTodos: Todo[],
  completedTodos: Todo[],
  hasError: boolean,
  errorMessage: ErrorMessage,
  inputDisabled: boolean,
  handleAddTodo: (todoTitle: string) => void,
  handleDelete: (todo: Todo) => void,
  handleUpdateTodo: (todo: Todo, fieldsToUpdate: UpdateData) => void,
  handleToggleAll: () => void,
  changeHasError: (value: boolean) => void,
  deleteAllCompleted: () => void,
  USER_ID: number,
  isLoading: boolean,
};

export const TodosContext = React.createContext<ContextType>({
  todos: [],
  tempTodo: null,
  processedTodos: [],
  activeTodos: [],
  completedTodos: [],
  hasError: false,
  errorMessage: ErrorMessage.NONE,
  inputDisabled: false,
  handleAddTodo: () => { },
  handleDelete: () => { },
  handleUpdateTodo: () => { },
  handleToggleAll: () => { },
  changeHasError: () => { },
  deleteAllCompleted: () => { },
  USER_ID,
  isLoading: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TodosProvider: React.FC<any> = (
  { children },
) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedTodos, setProcessedTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [
    errorMessage,
    setErrorMessage,
  ] = useState<ErrorMessage>(ErrorMessage.NONE);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  const fetchUserTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(ErrorMessage.FIND);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserTodos();
  }, []);

  const handleAddTodo = useCallback(async (todoTitle: string) => {
    if (!todoTitle) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);
      setHasError(true);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      setInputDisabled(true);

      await addTodo(USER_ID, newTodo);
      await fetchUserTodos();
    } catch (error) {
      setHasError(true);
      setErrorMessage(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
      setInputDisabled(false);
    }
  }, []);

  const handleDelete = useCallback(async (todo: Todo) => {
    setProcessedTodos((currentTodos) => [...currentTodos, todo]);

    try {
      await deleteTodo(todo.id);
      await fetchUserTodos();
    } catch (error) {
      setHasError(true);
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setProcessedTodos([]);
    }
  }, []);

  const handleUpdateTodo = useCallback(async (
    todo: Todo,
    fieldsToUpdate: UpdateData,
  ) => {
    setProcessedTodos(currentTodos => [...currentTodos, todo]);
    try {
      await updateTodo(todo.id, fieldsToUpdate);
      await fetchUserTodos();
    } catch {
      setHasError(true);
      setErrorMessage(ErrorMessage.UPDATE);
    } finally {
      setProcessedTodos(currentTodos => (
        currentTodos.filter(currTodo => currTodo.id !== todo.id)));
    }
  }, []);

  const activeTodos = useMemo(() => {
    return getFilteredTodos(todos, FilterTypes.Active);
  }, [todos]);
  const completedTodos = useMemo(() => {
    return getFilteredTodos(todos, FilterTypes.Completed);
  }, [todos]);

  const handleToggleAll = useCallback(async () => {
    if (activeTodos.length) {
      try {
        setProcessedTodos((currentTodos) => [...currentTodos, ...activeTodos]);

        await Promise.all(
          activeTodos.map(({ id }) => updateTodo(id, { completed: true })),
        );
        await fetchUserTodos();
      } catch {
        setHasError(true);
        setErrorMessage(ErrorMessage.UPDATE);
      } finally {
        setProcessedTodos([]);
      }

      return;
    }

    try {
      setProcessedTodos((currentTodos) => [...currentTodos, ...todos]);

      await Promise.all(
        todos.map(({ id }) => updateTodo(id, { completed: false })),
      );
      await fetchUserTodos();
    } catch {
      setErrorMessage(ErrorMessage.UPDATE);
    } finally {
      setProcessedTodos([]);
    }
  }, [activeTodos, todos]);

  const changeHasError = useCallback((value: boolean) => (
    setHasError(value)
  ), []);

  const deleteAllCompleted = useCallback(async () => {
    try {
      setProcessedTodos((currentTodos) => [...currentTodos, ...completedTodos]);
      await Promise.all(
        completedTodos.map(todo => handleDelete(todo)),
      );
      await fetchUserTodos();
    } catch {
      setHasError(true);
      setErrorMessage(ErrorMessage.DELETE);
    } finally {
      setProcessedTodos([]);
    }
  }, [completedTodos]);

  const contextValue = useMemo(() => {
    return {
      todos,
      tempTodo,
      processedTodos,
      activeTodos,
      completedTodos,
      hasError,
      errorMessage,
      inputDisabled,
      handleAddTodo,
      handleDelete,
      handleUpdateTodo,
      handleToggleAll,
      changeHasError,
      deleteAllCompleted,
      USER_ID,
      isLoading,
    };
  }, [todos, processedTodos, tempTodo, errorMessage, hasError, isLoading]);

  return (
    <TodosContext.Provider value={contextValue}>
      {children}
    </TodosContext.Provider>
  );
};
