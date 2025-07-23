import { useState, useEffect, useCallback } from 'react';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';
import { ERROR_MESSAGES, TIMEOUTS } from '../constants';

type TodoStatus = 'all' | 'active' | 'completed';

const filterTodos = (todos: Todo[], status: TodoStatus): Todo[] => {
  if (status === 'active') {
    return todos.filter(todo => !todo.completed);
  }

  if (status === 'completed') {
    return todos.filter(todo => todo.completed);
  }

  return todos;
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<TodoStatus>('all');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittingTodoIds, setSubmittingTodoIds] = useState<number[]>([]);

  const visibleTodos = filterTodos(todos, status);

  useEffect(() => {
    if (!todoService.USER_ID) {
      return;
    }

    const loadTodos = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const loadedTodos = await todoService.getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage(ERROR_MESSAGES.LOAD_TODOS);
      } finally {
        setLoading(false);
      }
    };

    void loadTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, TIMEOUTS.ERROR_MESSAGE_TIMEOUT);

      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [errorMessage]);

  const createTodo = useCallback(async (title: string) => {
    const optimisticTodo: Todo = {
      id: 0,
      title,
      userId: todoService.USER_ID,
      completed: false,
    };

    setErrorMessage('');
    setIsSubmitting(true);
    setTempTodo(optimisticTodo);

    try {
      const createdTodo = await todoService.createTodo(optimisticTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.ADD_TODO);
      throw error;
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  }, []);

  const updateTodo = useCallback(async (todo: Todo) => {
    setErrorMessage('');
    setIsSubmitting(true);
    setSubmittingTodoIds(currentIds => [...currentIds, todo.id]);

    try {
      const updatedTodo = await todoService.updateTodo(todo);

      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
        ),
      );
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);
      throw error;
    } finally {
      setIsSubmitting(false);
      setSubmittingTodoIds(currentIds =>
        currentIds.filter(currentId => currentId !== todo.id),
      );
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    setErrorMessage('');
    setIsSubmitting(true);
    setSubmittingTodoIds(currentIds => [...currentIds, id]);

    try {
      await todoService.deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ERROR_MESSAGES.DELETE_TODO);
      throw error;
    } finally {
      setIsSubmitting(false);
      setSubmittingTodoIds(currentIds =>
        currentIds.filter(currentId => currentId !== id),
      );
    }
  }, []);

  const deleteCompletedTodos = useCallback(async (ids: number[]) => {
    setErrorMessage('');
    setIsSubmitting(true);
    setSubmittingTodoIds(currentIds => [...currentIds, ...ids]);

    try {
      const results = await Promise.allSettled(
        ids.map(id => todoService.deleteTodo(id)),
      );

      const successfulIds: number[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulIds.push(ids[index]);
        }
      });

      if (successfulIds.length > 0) {
        setTodos(current =>
          current.filter(todo => !successfulIds.includes(todo.id)),
        );
      }

      const hasFailures = results.some(result => result.status === 'rejected');

      if (hasFailures) {
        setErrorMessage(ERROR_MESSAGES.DELETE_TODO);
      }
    } catch {
      setErrorMessage(ERROR_MESSAGES.DELETE_TODO);
    } finally {
      setIsSubmitting(false);
      setSubmittingTodoIds(currentIds =>
        currentIds.filter(id => !ids.includes(id)),
      );
    }
  }, []);

  const toggleAll = useCallback(async () => {
    const shouldCompleteAll = todos.some(todo => !todo.completed);

    const todosToUpdate = todos
      .filter(todo => todo.completed !== shouldCompleteAll)
      .map(todo => ({
        ...todo,
        completed: shouldCompleteAll,
      }));

    if (todosToUpdate.length === 0) {
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    setSubmittingTodoIds(todosToUpdate.map(todo => todo.id));

    try {
      const results = await Promise.allSettled(
        todosToUpdate.map(todo => todoService.updateTodo(todo)),
      );

      const updatedTodos = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<Todo>).value);

      if (updatedTodos.length > 0) {
        setTodos(currentTodos =>
          currentTodos.map(
            todo =>
              updatedTodos.find(updated => updated.id === todo.id) || todo,
          ),
        );
      }

      const hasFailures = results.some(result => result.status === 'rejected');

      if (hasFailures) {
        setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);
      }
    } catch {
      setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);
    } finally {
      setIsSubmitting(false);
      setSubmittingTodoIds([]);
    }
  }, [todos]);

  return {
    todos,
    visibleTodos,
    tempTodo,
    status,
    loading,
    isSubmitting,
    errorMessage,
    submittingTodoIds,
    setStatus,
    setErrorMessage,
    createTodo,
    updateTodo,
    deleteTodo,
    deleteCompletedTodos,
    toggleAll,
  };
};
