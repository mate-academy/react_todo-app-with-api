/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import {
  USER_ID,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api/todos';
import { Todo, FILTERS, Filter } from './types/Todo';

import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const [resetSignal, setResetSignal] = useState(0);

  // Load todos from API
  const loadTodos = async () => {
    setError('');
    setIsLoading(true);

    try {
      const data = await getTodos();

      setTodos(data);
    } catch {
      setError('Unable to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // Auto-hide error after 3 seconds
  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  const activeTodos = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );
  const completedCount = useMemo(
    () => todos.filter(t => t.completed).length,
    [todos],
  );

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case FILTERS.active:
        return todos.filter(t => !t.completed);
      case FILTERS.completed:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // ADD TODO
  const handleAddTodo = async (title: string) => {
    const trimmed = title.trim();

    if (!trimmed) {
      setError('Title should not be empty');

      return;
    }

    setIsAdding(true);
    setError('');

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const created = await createTodo({
        userId: USER_ID,
        title: trimmed,
        completed: false,
      });

      setTodos(prev => [...prev, created]);
      setResetSignal(prev => prev + 1);
      setTempTodo(null);
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
    } finally {
      setIsAdding(false);
    }
  };

  // DELETE ONE TODO
  const handleDeleteTodo = async (id: number) => {
    setError('');
    setLoadingIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      setResetSignal(prev => prev + 1);
    } catch {
      setError('Unable to delete a todo');
      throw new Error('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(i => i !== id));
    }
  };

  // TOGGLE ONE TODO
  const handleToggleTodo = async (id: number, completed: boolean) => {
    setError('');
    setLoadingIds(prev => [...prev, id]);

    try {
      const updated = await updateTodo(id, { completed });

      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(i => i !== id));
    }
  };

  // UPDATE TODO TITLE
  const handleUpdateTodo = async (id: number, title: string) => {
    setError('');
    setLoadingIds(prev => [...prev, id]);

    try {
      const updated = await updateTodo(id, { title });

      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch {
      setError('Unable to update a todo');
      throw new Error('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(i => i !== id));
    }
  };

  // TOGGLE ALL TODOS
  const handleToggleAll = async () => {
    const shouldComplete = todos.some(t => !t.completed);

    setError('');

    const idsToUpdate = todos
      .filter(t => t.completed !== shouldComplete)
      .map(t => t.id);

    setLoadingIds(prev => [...prev, ...idsToUpdate]);

    try {
      const results = await Promise.allSettled(
        todos
          .filter(t => t.completed !== shouldComplete)
          .map(t => updateTodo(t.id, { completed: shouldComplete })),
      );

      const updated = todos.map(todo => {
        if (todo.completed === shouldComplete) {
          return todo;
        }

        const index = idsToUpdate.indexOf(todo.id);
        const res = results[index];

        return res.status === 'fulfilled' ? res.value : todo;
      });

      setTodos(updated);
    } finally {
      setLoadingIds([]);
    }
  };

  // CLEAR COMPLETED
  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    if (!completed.length) {
      return;
    }

    setError('');

    const ids = completed.map(t => t.id);

    setLoadingIds(prev => [...prev, ...ids]);

    const results = await Promise.allSettled(
      completed.map(t => deleteTodo(t.id)),
    );

    const successfullyDeletedIds = completed
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(t => t.id);

    const failed = results.some(r => r.status === 'rejected');

    if (failed) {
      setError('Unable to delete a todo');
    }

    setTodos(prev => prev.filter(t => !successfullyDeletedIds.includes(t.id)));

    setLoadingIds(prev => prev.filter(id => !ids.includes(id)));

    setResetSignal(prev => prev + 1);
  };

  const hasTodos = todos.length > 0 || tempTodo !== null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          activeTodos={activeTodos}
          todosLength={todos.length}
          onAdd={handleAddTodo}
          onToggleAll={handleToggleAll}
          disabled={isAdding}
          resetSignal={resetSignal}
        />

        {/* Global loader overlay */}
        {isLoading && (
          <div data-cy="GlobalLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}

        {/* Todo list */}
        {hasTodos && (
          <TodoList
            todos={tempTodo ? [...filteredTodos, tempTodo] : filteredTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
            loadingIds={loadingIds}
          />
        )}

        {/* Footer */}
        {hasTodos && (
          <TodoFooter
            activeTodos={activeTodos}
            filter={filter}
            setFilter={setFilter}
            completedCount={completedCount}
            onClearCompleted={handleClearCompleted}
            disabled={isAdding || isLoading}
          />
        )}
      </div>

      {/* Error notification */}
      <ErrorNotification error={error} clearError={() => setError('')} />
    </div>
  );
};
