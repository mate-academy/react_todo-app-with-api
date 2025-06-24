import { useCallback, useState } from 'react';
import { deleteTodo, updateTodo, postTodo, USER_ID } from '../api/todos';
import { ErrorMessages } from '../enums/ErrorMessages';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

export const useTodoActions = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [isTodoSubmitting, setIsTodoSubmitting] = useState(false);

  const addToProcessing = (ids: number[]) => {
    setProcessingTodoIds(prev => [...prev, ...ids]);
  };

  const removeFromProcessing = (ids: number[]) => {
    setProcessingTodoIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const isAllTodosCompleted = useCallback((todoList: Todo[]) => {
    return todoList.every(todo => todo.completed);
  }, []);

  const addNewTodo = useCallback(
    async (title: string) => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        setErrorMessage(ErrorMessages.EmptyTitle);

        return;
      }

      const temporaryTodo: Todo = {
        id: 0,
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(temporaryTodo);
      setErrorMessage(null);
      setIsTodoSubmitting(true);

      try {
        const newTodo = await postTodo({
          title: trimmedTitle,
          userId: USER_ID,
        });

        setTodos(prev => {
          const withoutTemp = prev.filter(todo => todo.id !== 0);

          return [...withoutTemp, newTodo];
        });
        setTempTodo(null);
      } catch {
        setErrorMessage(ErrorMessages.AddFailed);
        setTempTodo(null);
        throw new Error(ErrorMessages.AddFailed);
      } finally {
        setIsTodoSubmitting(false);
      }
    },
    [setTodos, setErrorMessage, setTempTodo],
  );

  const deleteSingleTodo = useCallback(
    async (todoId: number) => {
      addToProcessing([todoId]);

      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch {
        setErrorMessage(ErrorMessages.DeleteFailed);
        throw new Error(ErrorMessages.DeleteFailed);
      } finally {
        removeFromProcessing([todoId]);
      }
    },
    [setTodos, setErrorMessage],
  );

  const deleteCompletedTodos = useCallback(
    async (completedIds: number[]) => {
      if (completedIds.length === 0) {
        return;
      }

      addToProcessing(completedIds);

      try {
        const results = await Promise.allSettled(
          completedIds.map(id =>
            deleteTodo(id).then(() => ({ id, success: true })),
          ),
        );

        const successfulIds = results
          .filter(
            (
              res,
            ): res is PromiseFulfilledResult<{ id: number; success: true }> =>
              res.status === 'fulfilled',
          )
          .map(res => res.value.id);

        const isSomeFailed = results.some(res => res.status === 'rejected');

        if (isSomeFailed) {
          setErrorMessage(ErrorMessages.DeleteFailed);
        }

        setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
      } catch (err) {
        setErrorMessage(ErrorMessages.DeleteFailed);
        throw new Error(ErrorMessages.DeleteFailed);
      } finally {
        removeFromProcessing(completedIds);
      }
    },
    [setTodos, setErrorMessage],
  );

  const toggleStatusSingleTodo = useCallback(
    async (todoId: number, completed: boolean) => {
      addToProcessing([todoId]);

      try {
        await updateTodo(todoId, { completed: completed });

        setTodos(prev =>
          prev.map(todo =>
            todo.id === todoId ? { ...todo, completed } : todo,
          ),
        );
      } catch {
        setErrorMessage(ErrorMessages.UpdateTodoFailed);
        throw new Error(ErrorMessages.UpdateTodoFailed);
      } finally {
        removeFromProcessing([todoId]);
      }
    },
    [setTodos, setErrorMessage],
  );

  const toggleStatusTodos = useCallback(
    async (todoList: Todo[]) => {
      const shouldComplete = !isAllTodosCompleted(todoList);

      const todosToUpdate = todoList.filter(
        todo => todo.completed !== shouldComplete,
      );
      const todoIds = todosToUpdate.map(todo => todo.id);

      if (todoIds.length === 0) {
        return;
      }

      addToProcessing(todoIds);

      try {
        const results = await Promise.allSettled(
          todosToUpdate.map(todo =>
            updateTodo(todo.id, { completed: shouldComplete }),
          ),
        );

        const successfulIds = todoIds.filter(
          (_, i) => results[i].status === 'fulfilled',
        );

        if (successfulIds.length !== todoIds.length) {
          setErrorMessage(ErrorMessages.UpdateTodoFailed);
        }

        setTodos(prev =>
          prev.map(todo =>
            successfulIds.includes(todo.id)
              ? { ...todo, completed: shouldComplete }
              : todo,
          ),
        );
      } catch {
        setErrorMessage(ErrorMessages.UpdateTodoFailed);
        throw new Error(ErrorMessages.UpdateTodoFailed);
      } finally {
        removeFromProcessing(todoIds);
      }
    },
    [setTodos, setErrorMessage, isAllTodosCompleted],
  );

  const onUpdateTodo = useCallback(
    async (todoId: number, title: string) => {
      const trimmedTitle = title.trim();

      setProcessingTodoIds(prev => [...prev, todoId]);

      setTodos(prev => {
        const originalTodo = prev.find(todo => todo.id === todoId);

        if (!originalTodo || originalTodo.title === title) {
          return prev;
        }

        return prev;
      });

      try {
        await updateTodo(todoId, {
          title: trimmedTitle,
          userId: USER_ID,
          completed: false,
        });

        setTodos(prev =>
          prev.map(todo =>
            todo.id === todoId
              ? { ...todo, title: trimmedTitle, completed: false }
              : todo,
          ),
        );
      } catch {
        setErrorMessage(ErrorMessages.UpdateTodoFailed);
        throw new Error(ErrorMessages.UpdateTodoFailed);
      } finally {
        setProcessingTodoIds(prev => prev.filter(id => id !== todoId));
      }
    },
    [setTodos, setErrorMessage, setProcessingTodoIds],
  );

  return {
    todos,
    setTodos,
    todosLoading,
    setTodosLoading,
    filter,
    setFilter,
    tempTodo,
    processingTodoIds,
    deleteSingleTodo,
    deleteCompletedTodos,
    toggleStatusSingleTodo,
    toggleStatusTodos,
    addNewTodo,
    isTodoSubmitting,
    isAllTodosCompleted,
    onUpdateTodo,
    errorMessage,
    setErrorMessage,
  };
};
