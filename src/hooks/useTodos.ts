import { useCallback, useRef, useState } from 'react';

import {
  getTodos as getTodosApi,
  removeTodo as removeTodoApi,
  updateTodo as updateTodoApi,
} from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorsEnum } from '../enums/ErrorMessage';
import {
  optimisticDeleteTodo,
  restoreTodo,
  Rollback,
} from '../utils/todoState';

type UseTodosOptions = {
  onError: (message: string) => void;
  onClearError: () => void;
};

export const useTodos = ({ onError, onClearError }: UseTodosOptions) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const processingIds = useRef<number[]>([]);

  const startProcessing = useCallback(
    (todoId: number) => {
      if (processingIds.current.includes(todoId)) {
        return false;
      }

      processingIds.current.push(todoId);
      setLoadingTodoIds(prev =>
        prev.includes(todoId) ? prev : [...prev, todoId],
      );
      onClearError();

      return true;
    },
    [onClearError],
  );

  const endProcessing = useCallback((todoId: number) => {
    const index = processingIds.current.indexOf(todoId);

    if (index !== -1) {
      processingIds.current.splice(index, 1);
    }

    setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
  }, []);

  const loadTodos = useCallback(() => {
    onClearError();

    getTodosApi()
      .then(setTodos)
      .catch(() => {
        onError(ErrorsEnum.LOAD);
      });
  }, [onError, onClearError]);

  const addTodo = useCallback((todo: Todo) => {
    setTodos(prev => [...prev, todo]);
  }, []);

  const updateTodo = useCallback(
    (todoId: number, changes: Partial<Omit<Todo, 'id'>>) => {
      if (!startProcessing(todoId)) {
        return Promise.resolve();
      }

      return updateTodoApi(todoId, changes)
        .then(updatedTodo => {
          setTodos(prev =>
            prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
          );
        })

        .catch(error => {
          onError(ErrorsEnum.UPDATE);
          throw error;
        })

        .finally(() => {
          endProcessing(todoId);
        });
    },
    [startProcessing, endProcessing, onError],
  );

  const removeTodo = useCallback(
    (todoId: number, isOptimistic = false) => {
      if (!startProcessing(todoId)) {
        return Promise.resolve();
      }

      if (isOptimistic) {
        let rollback: Rollback | null = null;

        setTodos(prev => {
          const result = optimisticDeleteTodo(prev, todoId);

          if (!result) {
            return prev;
          }

          rollback = result.rollback;

          return result.todos;
        });

        return removeTodoApi(todoId)
          .catch(error => {
            onError(ErrorsEnum.DELETE);

            if (!rollback) {
              throw error;
            }

            const rollbackToApply = rollback;

            setTodos(prev => restoreTodo(prev, rollbackToApply));
          })

          .finally(() => {
            endProcessing(todoId);
          });
      }

      return removeTodoApi(todoId)
        .then(() => {
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
        })

        .catch(error => {
          onError(ErrorsEnum.DELETE);
          throw error;
        })

        .finally(() => {
          endProcessing(todoId);
        });
    },
    [startProcessing, endProcessing, onError],
  );

  return {
    todos,
    loadingTodoIds,
    loadTodos,
    addTodo,
    removeTodo,
    updateTodo,
  };
};
