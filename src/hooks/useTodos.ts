import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import {
  TEMP_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../api/todos';
import { TodoError, TodoServiceErrors } from '../types/Errors';
import { TodoAgregate } from '../types/TodoAgregate';
import { TodoFormRef } from '../components/TodoForm/TodoForm';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputFocusRef = useRef<TodoFormRef>(null);

  const allTodosCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );
  const itemsLeft = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const handleAddTodoToProcessing = useCallback((todoId: Todo['id']) => {
    setProcessingTodoIds(current => [...current, todoId]);
  }, []);

  const handleRemoveTodoFromProcessing = useCallback((todoId: Todo['id']) => {
    setProcessingTodoIds(current => current.filter(id => id !== todoId));
  }, []);

  const replaceTodoInList = useCallback((updated: Todo) => {
    setTodos(current =>
      current.map(todo => (todo.id === updated.id ? updated : todo)),
    );
  }, []);

  const handleErrors = useCallback(
    (error: unknown, fallbackMessage: TodoError) => {
      if (error instanceof Error) {
        setErrorMessage(fallbackMessage);

        return;
      }

      setErrorMessage(TodoServiceErrors.Unknown);
    },
    [],
  );

  const loadTodos = useCallback(async () => {
    setInitialLoading(true);
    setErrorMessage(null);
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      setErrorMessage(TodoServiceErrors.UnableToLoad);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAddTodo = useCallback(
    async (newTodo: TodoAgregate) => {
      handleAddTodoToProcessing(TEMP_ID);
      setTempTodo({ id: TEMP_ID, ...newTodo });

      try {
        const createdTodo = await addTodo(newTodo);

        setTodos(current => [...current, createdTodo]);
      } catch (error) {
        handleErrors(error, TodoServiceErrors.UnableToAdd);

        throw error;
      } finally {
        setTempTodo(null);
        handleRemoveTodoFromProcessing(TEMP_ID);
      }
    },
    [handleAddTodoToProcessing, handleRemoveTodoFromProcessing, handleErrors],
  );

  const handlePartialTodoUpdate = useCallback(
    async (
      todoId: Todo['id'],
      fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
      fallbackError: TodoError = TodoServiceErrors.UnableToUpdate,
    ): Promise<void> => {
      handleAddTodoToProcessing(todoId);

      try {
        const updatedTodo = await updateTodo(todoId, fieldsToUpdate);

        replaceTodoInList(updatedTodo);
      } catch (error) {
        handleErrors(error, fallbackError);
        throw error;
      } finally {
        handleRemoveTodoFromProcessing(todoId);
      }
    },
    [
      handleAddTodoToProcessing,
      handleRemoveTodoFromProcessing,
      handleErrors,
      replaceTodoInList,
    ],
  );

  const handleToggleTodo = useCallback(
    async (todoId: Todo['id']) => {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        return;
      }

      await handlePartialTodoUpdate(todoId, {
        completed: !todoToUpdate.completed,
      });
    },
    [handlePartialTodoUpdate, todos],
  );

  const handleUpdateTodo = useCallback(
    async (todoId: Todo['id'], newTitle: string) => {
      if (!newTitle.trim()) {
        setErrorMessage(TodoServiceErrors.TitleShouldNotBeEmpty);

        return;
      }

      await handlePartialTodoUpdate(todoId, {
        title: newTitle.trim(),
      });
    },
    [handlePartialTodoUpdate],
  );

  const handleToggleAllTodos = useCallback(async () => {
    const status = !allTodosCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== status);

    await Promise.all(
      todosToUpdate.map(todo =>
        handlePartialTodoUpdate(todo.id, { completed: status }),
      ),
    );
  }, [handlePartialTodoUpdate, allTodosCompleted, todos]);

  const deleteOneTodo = useCallback(
    async (todoId: Todo['id']) => {
      handleAddTodoToProcessing(todoId);

      try {
        await deleteTodo(todoId);

        return { id: todoId, success: true };
      } catch (error) {
        handleErrors(error, TodoServiceErrors.UnableToDelete);

        return { id: todoId, success: false };
      } finally {
        handleRemoveTodoFromProcessing(todoId);
      }
    },
    [handleAddTodoToProcessing, handleRemoveTodoFromProcessing, handleErrors],
  );

  const handleDeleteTodo = useCallback(
    async (todoId: Todo['id']) => {
      const result = await deleteOneTodo(todoId);

      if (result.success) {
        setTodos(current => current.filter(todo => todo.id !== todoId));
        inputFocusRef.current?.focus();
      }
    },
    [deleteOneTodo],
  );

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.all(
      completedTodos.map(todo => deleteOneTodo(todo.id)),
    );

    const successfulIds = results
      .filter(result => result.success)
      .map(result => result.id);

    if (successfulIds.length) {
      setTodos(current =>
        current.filter(todo => !successfulIds.includes(todo.id)),
      );
    }

    if (results.some(result => !result.success)) {
      setErrorMessage(TodoServiceErrors.UnableToDelete);
    }

    inputFocusRef.current?.focus();
  }, [todos, deleteOneTodo]);

  return {
    todos,
    errorMessage,
    initialLoading,
    allTodosCompleted,
    itemsLeft,
    hasCompletedTodos,
    processingTodoIds,
    tempTodo,
    inputFocusRef,
    setTodos,
    setErrorMessage,
    setInitialLoading,
    handleDeleteTodo,
    handleAddTodo,
    handleToggleTodo,
    handleToggleAllTodos,
    handleUpdateTodo,
    handleClearCompleted,
  };
};
