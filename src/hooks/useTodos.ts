/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorText } from '../types/ErrorText';
import { Filter } from '../types/Filter';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [focusTrigger, setFocusTrigger] = useState(0);

  useEffect(() => {
    setError(null);

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorText.Load));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = window.setTimeout(() => {
      setError(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [error]);

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const visibleTodos = useMemo(
    () =>
      todos.filter(todo => {
        switch (filter) {
          case Filter.Active:
            return !todo.completed;

          case Filter.Completed:
            return todo.completed;

          default:
            return true;
        }
      }),
    [todos, filter],
  );

  const handleFilterClick =
    (value: Filter) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setFilter(value);
    };

  const handleAdd = async (title: string): Promise<boolean> => {
    const trimmed = title.trim();

    if (!trimmed) {
      setError(ErrorText.EmptyTitle);

      return false;
    }

    setError(null);
    setIsAdding(true);

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const newTodo = await createTodo(trimmed);

      setTodos(prev => [...prev, newTodo]);

      return true;
    } catch {
      setError(ErrorText.Add);

      return false;
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleToggleAll = async () => {
    if (todos.length === 0) {
      return;
    }

    const shouldBeCompleted = !isAllCompleted;

    const targetTodos = todos.filter(
      todo => todo.completed !== shouldBeCompleted,
    );

    if (targetTodos.length === 0) {
      return;
    }

    setDeletingIds(prev => [...prev, ...targetTodos.map(t => t.id)]);

    try {
      const results = await Promise.allSettled(
        targetTodos.map(todo =>
          updateTodo(todo.id, { completed: shouldBeCompleted }),
        ),
      );

      const successfulIds = targetTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      const failedIds = targetTodos
        .filter((_, index) => results[index].status === 'rejected')
        .map(todo => todo.id);

      if (failedIds.length > 0) {
        setError(ErrorText.Update);
      }

      setTodos(prev =>
        prev.map(todo =>
          successfulIds.includes(todo.id)
            ? { ...todo, completed: shouldBeCompleted }
            : todo,
        ),
      );
    } finally {
      setDeletingIds(prev =>
        prev.filter(id => !targetTodos.some(todo => todo.id === id)),
      );
    }
  };

  const handleDelete = async (todoId: number) => {
    setDeletingIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
      setFocusTrigger(prev => prev + 1);
    } catch {
      setError(ErrorText.Delete);
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setDeletingIds(prev => [...prev, ...completedTodos.map(t => t.id)]);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      const successfulIds = completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      const failedIds = completedTodos
        .filter((_, index) => results[index].status === 'rejected')
        .map(todo => todo.id);

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      if (failedIds.length > 0) {
        setError(ErrorText.Delete);
      } else {
        setFocusTrigger(prev => prev + 1);
      }
    } finally {
      setDeletingIds(prev =>
        prev.filter(id => !completedTodos.some(todo => todo.id === id)),
      );
    }
  };

  const handleToggle = async (todo: Todo) => {
    const { id, completed } = todo;

    setDeletingIds(prev => [...prev, id]);

    try {
      const updatedTodo = await updateTodo(id, { completed: !completed });

      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
    } catch {
      setError(ErrorText.Update);
    } finally {
      setDeletingIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleRename = async (
    todo: Todo,
    newTitle: string,
  ): Promise<boolean> => {
    const trimmed = newTitle.trim();

    if (trimmed === todo.title) {
      return true;
    }

    if (!trimmed) {
      setDeletingIds(prev => [...prev, todo.id]);

      try {
        await deleteTodo(todo.id);

        setTodos(prev => prev.filter(t => t.id !== todo.id));

        return true;
      } catch {
        setError(ErrorText.Delete);

        return false;
      } finally {
        setDeletingIds(prev => prev.filter(id => id !== todo.id));
      }
    }

    setDeletingIds(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, { title: trimmed });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));

      return true;
    } catch {
      setError(ErrorText.Update);

      return false;
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const hideError = () => setError(null);

  return {
    todos,
    filter,
    error,
    tempTodo,
    isAdding,
    deletingIds,
    focusTrigger,
    isAllCompleted,
    visibleTodos,
    handleFilterClick,
    handleAdd,
    handleDelete,
    handleClearCompleted,
    handleToggle,
    handleToggleAll,
    handleRename,
    hideError,
  };
};
