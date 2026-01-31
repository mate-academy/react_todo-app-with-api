/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, TodoFilter } from './types/Todo';
import * as todoApi from './api/todos';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<Set<number>>(new Set());

  const timeRef = useRef<number | null>(null);
  const newTodoRef = useRef<HTMLInputElement>(null);
  const activeCount = todos.filter(t => !t.completed).length;

  useEffect(() => {
    if (!tempTodo) {
      newTodoRef.current?.focus();
    }
  }, [tempTodo]);

  const hideNotification = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }

    setErrorMessage('');
  };

  const showNotification = useCallback((message: string) => {
    hideNotification();
    setErrorMessage(message);
    timeRef.current = window.setTimeout(hideNotification, 3000);
  }, []);

  const handleDeleteTodo = async (id: number) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, loading: true } : todo)),
    );
    setProcessings(prev => new Set(prev).add(id));

    try {
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      setTimeout(() => newTodoRef.current?.focus(), 0);
    } catch {
      showNotification('Unable to delete a todo');
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, loading: false } : todo)),
      );
    } finally {
      setProcessings(prev => {
        const copy = new Set(prev);

        copy.delete(id);

        return copy;
      });
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    setProcessings(prev => new Set(prev).add(id));

    try {
      const updated = await todoApi.updateTodo(id, { completed });

      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));
    } catch {
      showNotification('Unable to update a todo');
    } finally {
      setProcessings(prev => {
        const copy = new Set(prev);

        copy.delete(id);

        return copy;
      });
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(t => t.completed);
    const newState = !allCompleted;

    const todosToUpdate = todos.filter(t => t.completed !== newState);

    if (!todosToUpdate.length) {
      return;
    }

    setProcessings(prev => {
      const copy = new Set(prev);

      todosToUpdate.forEach(t => copy.add(t.id));

      return copy;
    });

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        todoApi.updateTodo(todo.id, { completed: newState }),
      ),
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        setTodos(prev =>
          prev.map(t => (t.id === todosToUpdate[index].id ? result.value : t)),
        );
      } else {
        showNotification('Unable to update a todo');
      }
    });

    setProcessings(prev => {
      const copy = new Set(prev);

      todosToUpdate.forEach(t => copy.delete(t.id));

      return copy;
    });
  };

  const handleClearCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (!completedIds.length) {
      return;
    }

    setProcessings(prev => {
      const copy = new Set(prev);

      completedIds.forEach(id => copy.add(id));

      return copy;
    });

    const results = await Promise.allSettled(
      completedIds.map(id => todoApi.deleteTodo(id)),
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        setTodos(prev => prev.filter(t => t.id !== completedIds[index]));
      } else {
        showNotification('Unable to delete a todo');
      }
    });

    setProcessings(prev => {
      const copy = new Set(prev);

      completedIds.forEach(id => copy.delete(id));

      return copy;
    });

    setTimeout(() => newTodoRef.current?.focus(), 0);
  };

  useEffect(() => {
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      hideNotification();
      setLoading(true);
      try {
        const data = await todoApi.getTodos();

        setTodos(data);
        newTodoRef.current?.focus();
      } catch {
        showNotification('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [showNotification]);

  if (!todoApi.USER_ID) {
    return <UserWarning />;
  }

  const handleRenameTodo = async (id: number, title: string) => {
    setProcessings(prev => new Set(prev).add(id));

    try {
      const updated = await todoApi.updateTodo(id, { title });

      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));

      return true;
    } catch {
      showNotification('Unable to update a todo');

      return false;
    } finally {
      setProcessings(prev => {
        const copy = new Set(prev);

        copy.delete(id);

        return copy;
      });
    }
  };

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTodoRef.current?.value.trim() || '';

    if (!title) {
      showNotification('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: todoApi.USER_ID!,
      loading: true,
    });

    try {
      const newTodo = await todoApi.createTodo({
        title,
        completed: false,
        userId: todoApi.USER_ID!,
      });

      setTodos(prev => [...prev, newTodo]);
      newTodoRef.current!.value = '';
      setTimeout(() => newTodoRef.current?.focus(), 0);
    } catch {
      showNotification('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && !loading && (
            <button
              type="button"
              className={`todoapp__toggle-all ${activeCount === 0 ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={newTodoRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={!!tempTodo}
            />
          </form>
        </header>

        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          filter={filter}
          processings={processings}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleTodo}
          onRename={handleRenameTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeCount={activeCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
            hasCompleted={todos.some(t => t.completed)}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
        role="alert"
        aria-live="assertive"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideNotification}
        />
        {errorMessage}
      </div>
    </div>
  );
};
