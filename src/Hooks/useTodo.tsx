import { useCallback, useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../types/ErrorMessages';
import { FilterOptions } from '../types/FilterOptions';
import { debounce } from 'lodash';
import { deleteTodo, getTodos, patchTodo } from '../api/todos';
import { getFilteredTodos } from '../utils/GetFilteredTodos';

export function useTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorMessages>(ErrorMessages.None);
  const [idsForDelete, setIdsForDelete] = useState<number[]>([]);
  const [todosForUpdate, setTodosForUpdate] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.All,
  );

  const handleSetError = useCallback((newError: ErrorMessages) => {
    const hideError = debounce(setError, 3000);

    setError(newError);

    hideError(ErrorMessages.None);
  }, []);

  const handleDeleteTodos = useCallback(
    (ids: number[]) => {
      Promise.all(
        ids.map(id => {
          setIdsForDelete(current => [...current, id]);

          deleteTodo(id)
            .then(() => {
              setTodos(current => current.filter(todo => todo.id !== id));
            })
            .catch(() => {
              handleSetError(ErrorMessages.DeleteFail);
            })
            .finally(() =>
              setIdsForDelete(currIds =>
                currIds.filter(currId => currId !== id),
              ),
            );
        }),
      );
    },
    [handleSetError],
  );

  const handleChangeTodos = useCallback(
    (newTodos: Todo[]) => {
      return Promise.all(
        newTodos.map(todo => {
          setTodosForUpdate(current => [...current, todo]);

          const { id, ...todoBody } = todo;

          return patchTodo(todoBody, id)
            .then(() => {
              setTodos(current =>
                current.map(currentTodo => {
                  return currentTodo.id !== todo.id ? currentTodo : todo;
                }),
              );
            })
            .catch(() => {
              handleSetError(ErrorMessages.UpdateFail);
              throw new Error(error);
            })
            .finally(() => setTodosForUpdate([]));
        }),
      );
    },
    [error, handleSetError],
  );

  const hideError = useCallback(() => {
    return setError(ErrorMessages.None);
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleSetError(ErrorMessages.LoadFail));
  }, [handleSetError]);

  const completedTodosId = useMemo(() => {
    return todos.filter(todo => todo.completed).map(todo => todo.id);
  }, [todos]);

  const numberOfActiveTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filterOption);
  }, [todos, filterOption]);

  return {
    todos,
    tempTodo,
    error,
    idsForDelete,
    todosForUpdate,
    filterOption,
    completedTodosId,
    numberOfActiveTodos,
    filteredTodos,
    setTodos,
    setTempTodo,
    setIdsForDelete,
    setTodosForUpdate,
    setFilterOption,
    handleSetError,
    handleDeleteTodos,
    handleChangeTodos,
    hideError,
  };
}
