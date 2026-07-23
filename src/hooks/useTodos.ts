import { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';
import { ErrorMessage } from '../types/ErrorMessage';
import { getTodos, deleteTodo, updateTodo } from '../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    setErrorMessage(null);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.Delete);
      throw new Error('Delete failed');
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    setLoadingTodoIds(prev => [...prev, updatedTodo.id]);
    setErrorMessage(null);

    try {
      const savedTodo = await updateTodo(updatedTodo);

      setTodos(prev =>
        prev.map(todo => (todo.id === savedTodo.id ? savedTodo : todo)),
      );
    } catch {
      setErrorMessage(ErrorMessage.Update);
      throw new Error('Update failed');
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== updatedTodo.id));
    }
  };

  const handleToggleAll = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);
    const targetStatus = !isAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    const updatePromises = todosToUpdate.map(todo =>
      handleUpdateTodo({ ...todo, completed: targetStatus }),
    );

    await Promise.allSettled(updatePromises);
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return {
    todos,
    setTodos,
    filter,
    setFilter,
    errorMessage,
    setErrorMessage,
    loadingTodoIds,
    tempTodo,
    setTempTodo,
    handleDeleteTodo,
    handleUpdateTodo,
    handleToggleAll,
    filteredTodos,
    isAllCompleted,
  };
};
