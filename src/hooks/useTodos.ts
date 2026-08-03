import { useCallback, useRef, useState } from 'react';
import {
  getTodos as getTodosApi,
  createTodo as createTodoApi,
  removeTodo as removeTodoApi,
  updateTodo as updateTodoApi,
} from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorsEnum } from '../enums/ErrorMessage';
import {
  appendTodo,
  replaceTodo,
  removeTodoById,
  Rollback,
  optimisticDeleteTodo,
  restoreTodo,
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
      setLoadingTodoIds(prev => [...prev, todoId]);
      onClearError();

      return true;
    },
    [onClearError],
  );

  const endProcessing = useCallback((todoId: number) => {
    const processingIndex = processingIds.current.indexOf(todoId);

    if (processingIndex !== -1) {
      processingIds.current.splice(processingIndex, 1);
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

  const createTodo = useCallback(
    (todo: Omit<Todo, 'id'>) => {
      onClearError();

      return createTodoApi(todo)
        .then(createdTodo => {
          setTodos(prev => appendTodo(prev, createdTodo));

          return createdTodo;
        })
        .catch(error => {
          onError(ErrorsEnum.ADD);
          throw error;
        });
    },
    [onClearError, onError],
  );

  const updateTodo = useCallback(
    (todoId: number, changes: Partial<Omit<Todo, 'id'>>) => {
      if (!startProcessing(todoId)) {
        return Promise.resolve();
      }

      return updateTodoApi(todoId, changes)
        .then(updatedTodo => {
          setTodos(prev => replaceTodo(prev, updatedTodo));
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

      let rollback: Rollback | null = null;

      if (isOptimistic) {
        setTodos(prev => {
          const result = optimisticDeleteTodo(prev, todoId);

          if (!result) {
            return prev;
          }

          rollback = result.rollback;

          return result.todos;
        });
      }

      return removeTodoApi(todoId)
        .then(() => {
          if (!isOptimistic) {
            setTodos(prev => removeTodoById(prev, todoId));
          }
        })
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
    },
    [startProcessing, endProcessing, onError],
  );

  return {
    todos,
    loadingTodoIds,
    loadTodos,
    createTodo,
    removeTodo,
    updateTodo,
  };
};
