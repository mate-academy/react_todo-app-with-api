/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as api from '../api/todos';
import { USER_ID } from '../utils/constants';

import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { Error } from '../types/Error';

type Props = {
  children: ReactNode;
};

export const TodoContext = React.createContext({
  todos: [] as Todo[],
  setTodos: (_todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => { },
  status: Status.All,
  setStatus: (_status: Status) => { },
  errorMessage: null as string | null,
  setErrorMessage: (_message: Error | null) => { },
  deletedTodos: [] as Todo[] | null,
  setDeletedTodos: (_value: Todo[]) => { },
  tempTodo: null as Todo | null,
  setTempTodo: (_todo: Todo | null) => { },
  deleteTodo: (_todoId: number) => { },
  deleteCompeledTodos: () => { },
  addTodo: (_todo: Todo) => { },
  updateTodo: (_todo: Todo, _fieldToUpdate: string, _newValue: unknown) => { },
  updateAllTodos: () => { },
  isAllTodosCompleted: false,
  processingIds: [] as number[],
  setProcessingIds: (_ids: number[] | ((prevIds: number[]) => number[])) => { },
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [deletedTodos, setDeletedTodos] = useState<Todo[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const isAllTodosCompleted = todos.every(todo => todo.completed);

  const getTodos = async () => {
    try {
      const todosFromServer = await api.getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(Error.GET);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = useCallback(async (todoToAdd: Todo) => {
    try {
      setProcessingIds(ids => [...ids, todoToAdd.id]);

      const newTodo = await api.createTodo(todoToAdd);

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      setErrorMessage(Error.ADD);
    } finally {
      setTempTodo(null);
      setProcessingIds(ids => ids.filter(id => id !== todoToAdd.id));
    }
  }, []);

  const updateTodo = useCallback(async (
    todoToUpdate: Todo,
    fieldToUpdate: string,
    newValue: unknown,
  ) => {
    try {
      setProcessingIds(ids => [...ids, todoToUpdate.id]);

      const updatedTodo = {
        ...todoToUpdate,
        [fieldToUpdate]: newValue,
      };

      await api.updateTodo(updatedTodo);

      setTodos(currentTodos => {
        const newTodos = [...currentTodos];
        const index = newTodos
          .findIndex(currentTodo => currentTodo.id === todoToUpdate.id);

        newTodos.splice(index, 1, updatedTodo);

        return newTodos;
      });
    } catch (error) {
      setErrorMessage(Error.UPDATE);
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todoToUpdate.id));
    }
  }, []);

  const updateAllTodos = () => {
    try {
      const uncompletedTodos = todos
        .filter(todo => todo.completed === isAllTodosCompleted);

      uncompletedTodos
        .forEach((todo) => updateTodo(todo, 'completed', !todo.completed));
    } catch (error) {
      setErrorMessage(Error.UPDATE);
    }
  };

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setProcessingIds(ids => [...ids, todoId]);

      await api.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(Error.DELETE);
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todoId));
    }
  }, []);

  const deleteCompeledTodos = async () => {
    try {
      const updadetTodos = todos.filter(todo => todo.completed);

      setDeletedTodos(updadetTodos);

      await Promise.all(updadetTodos.map(todo => api.deleteTodo(todo.id)));

      setTodos(currentTodos => currentTodos
        .filter(todo => !todo.completed));
    } catch (error) {
      setErrorMessage(Error.DELETE);
    } finally {
      setDeletedTodos(null);
    }
  };

  const value = useMemo(() => {
    return {
      todos,
      setTodos,
      status,
      setStatus,
      errorMessage,
      setErrorMessage,
      deletedTodos,
      setDeletedTodos,
      deleteTodo,
      deleteCompeledTodos,
      addTodo,
      updateTodo,
      tempTodo,
      setTempTodo,
      updateAllTodos,
      isAllTodosCompleted,
      processingIds,
      setProcessingIds,
    };
  }, [
    todos,
    status,
    errorMessage,
    deletedTodos,
    tempTodo,
    isAllTodosCompleted,
    processingIds,
  ]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
