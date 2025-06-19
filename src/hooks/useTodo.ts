import { useCallback, useEffect, useState } from 'react';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoServiceErrors, TodoServiceErrorsValues } from '../types/Errors';
import { FilterType, FilterTypeValues } from '../types/FilterType';
import { getVisibleTodos } from '../utils/getVisibleTodos';

export function useTodo() {
  const [data, setData] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] =
    useState<TodoServiceErrorsValues | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoIdsInProgress, setTodoIdsInProgress] = useState<number[]>([]);

  const [filter, setFilter] = useState<FilterTypeValues>(FilterType.All);
  const visibleTodos: Todo[] = getVisibleTodos(data, filter);

  const countOfActiveTodos = data.filter(todo => !todo.completed).length;

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null);
    todoService
      .getTodos()
      .then(setData)
      .catch(() => setErrorMessage(TodoServiceErrors.UnableToLoad))
      .finally(() => setIsLoading(false));
  }, []);

  // #region deleteTodo

  const deleteTodo = useCallback(
    (todoId: number) => {
      setTodoIdsInProgress([todoId]);

      return todoService
        .deleteTodos(todoId)
        .then(() => {
          setData(prev => prev.filter(todo => todo.id !== todoId));
        })
        .catch(() => {
          setErrorMessage(TodoServiceErrors.UnableToDelete);
          throw new Error(TodoServiceErrors.UnableToDelete);
        })
        .finally(() => {
          setTodoIdsInProgress([]);
        });
    },
    [setData, setErrorMessage, setTodoIdsInProgress],
  );

  // #endregion

  const hasCompletedTodos = data.some(todo => todo.completed);

  // #region deleteCompletedTodos
  const hasActiveTodos = countOfActiveTodos > 0;

  const deleteCompletedTodos = useCallback(() => {
    const completedIds = data
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedIds.length === 0) {
      return Promise.resolve();
    }

    setTodoIdsInProgress(completedIds);

    return Promise.allSettled(
      completedIds.map(id => todoService.deleteTodos(id).then(() => id)),
    )
      .then(results => {
        const successIds = results
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<number>).value);

        const isSomeFailed = results.some(r => r.status === 'rejected');

        if (isSomeFailed) {
          setErrorMessage(TodoServiceErrors.UnableToDelete);
        }

        setData(prev => prev.filter(todo => !successIds.includes(todo.id)));
      })
      .finally(() => {
        setTodoIdsInProgress([]);
      });
  }, [data, setTodoIdsInProgress, setErrorMessage, setData]);

  // #endregion

  // #region updateTodo
  const updateTodo = useCallback(
    (updatedTodo: Todo) => {
      setTodoIdsInProgress(current => [...current, updatedTodo.id]);

      return todoService
        .updateTodos(updatedTodo)
        .then(todo => {
          setData(currentData =>
            currentData.map(currentTodo =>
              currentTodo.id === updatedTodo.id ? todo : currentTodo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage(TodoServiceErrors.UnableToUpdate);
          throw new Error(TodoServiceErrors.UnableToUpdate);
        })
        .finally(() => {
          setTodoIdsInProgress(current =>
            current.filter(id => id !== updatedTodo.id),
          );
        });
    },
    [setData, setErrorMessage, setTodoIdsInProgress],
  );

  // #endregion

  // #region toggleTodos
  const toggleTodos = useCallback(() => {
    const todosToToggle = hasActiveTodos
      ? data.filter(todo => !todo.completed)
      : data;

    const toggledIds = todosToToggle.map(todo => todo.id);

    setTodoIdsInProgress(prev => [...prev, ...toggledIds]);

    return Promise.allSettled(
      todosToToggle.map(todo =>
        todoService
          .updateTodos({ ...todo, completed: !todo.completed })
          .then(() => ({ ...todo, completed: !todo.completed })),
      ),
    )
      .then(results => {
        const successTodos = results
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<Todo>).value);

        const isSomeFailed = results.some(r => r.status === 'rejected');

        if (isSomeFailed) {
          setErrorMessage(TodoServiceErrors.UnableToUpdate);
        }

        setData(prev =>
          prev.map(todo => {
            const updated = successTodos.find(t => t.id === todo.id);

            return updated ? updated : todo;
          }),
        );
      })
      .finally(() => {
        setTodoIdsInProgress(prev =>
          prev.filter(id => !toggledIds.includes(id)),
        );
      });
  }, [data, hasActiveTodos, setData, setTodoIdsInProgress, setErrorMessage]);
  // #endregion

  // #region addTodo
  const addTodo = useCallback(
    (newTodo: Omit<Todo, 'id'>) => {
      const tTodo: Todo = {
        id: 0,
        userId: todoService.USER_ID,
        title: newTodo.title,
        completed: false,
      };

      setTempTodo(tTodo);

      return todoService
        .createTodos(newTodo)
        .then(todoFromServer => {
          setData(prev => [...prev, todoFromServer]);
        })
        .finally(() => {
          setTempTodo(null);
        });
    },
    [setTempTodo, setData],
  );
  // #endregion

  return {
    data,
    isLoading,
    errorMessage,
    tempTodo,
    todoIdsInProgress,
    hasCompletedTodos,
    hasActiveTodos,
    setErrorMessage,
    deleteTodo,
    addTodo,
    deleteCompletedTodos,
    updateTodo,
    toggleTodos,
    visibleTodos,
    filter,
    setFilter,
    countOfActiveTodos,
  };
}
