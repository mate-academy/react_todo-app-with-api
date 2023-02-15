import React, {
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';
import { getTodos, updateTodo } from '../api/todos';
import { User } from '../types/User';
import { AuthContext } from '../components/Auth/AuthContext';

export const useLoadingTodosFromServer = (
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>,
) => {
  const user = useContext<User | null>(AuthContext);

  return useCallback(async () => {
    if (user) {
      try {
        const addTodos = await getTodos(user.id);

        await setTodos(addTodos);
      } catch {
        setErrorMessage(Errors.Loading);
      }
    }
  }, []);
};

export const useActiveTodos = (todos: Todo[]) => {
  return useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);
};

export const useCompleteTodos = (todos: Todo[]) => {
  return useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);
};

export const useOnFilteredStatusHandler = (
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>,
  setSelectedTodosId: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  const loadingTodosFromServer = useLoadingTodosFromServer(
    setTodos,
    setErrorMessage,
  );

  return useCallback(
    async (todo: Todo) => {
      const { completed, id } = todo;

      setErrorMessage(Errors.None);
      setSelectedTodosId(prevId => [...prevId, id]);

      try {
        await updateTodo(id, {
          completed: !completed,
        });

        await loadingTodosFromServer();
      } catch {
        setErrorMessage(Errors.Updating);
      } finally {
        setSelectedTodosId([]);
      }
    }, [],
  );
};
