/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  ReactNode,
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
  updateLoading: false,
  setUpdateLoading: (_value: boolean) => { },
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [deletedTodos, setDeletedTodos] = useState<Todo[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

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

  const addTodo = async (todoToAdd: Todo) => {
    try {
      const newTodo = await api.createTodo(todoToAdd);

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      setErrorMessage(Error.ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const updateTodo = async (
    todoToUpdate: Todo,
    fieldToUpdate: string,
    newValue: unknown,
  ) => {
    try {
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
    }
  };

  const updateAllTodos = async () => {
    try {
      setUpdateLoading(true);

      const updatedTodos = await Promise.all(todos.map(async (todo) => {
        const updatedTodo = {
          ...todo,
          completed: !isAllTodosCompleted,
        };

        await api.updateTodo(updatedTodo);

        return updatedTodo;
      }));

      setTodos(updatedTodos);
    } catch (error) {
      setErrorMessage(Error.UPDATE);
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      await api.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(Error.DELETE);
    }
  };

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
      updateLoading,
      setUpdateLoading,
    };
  }, [
    todos,
    status,
    errorMessage,
    deletedTodos,
    tempTodo,
    isAllTodosCompleted,
    updateLoading,
  ]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
