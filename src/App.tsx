import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter, Filters } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ERROR_MESSAGES } from './types/Errors';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimer = useRef<number | null>(null);

  const showError = (message: string) => {
    setError(message);

    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
    }

    errorTimer.current = window.setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch {
        showError(ERROR_MESSAGES.UNABLE_LOAD);
      }
    };

    load();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filters.Active:
        return !todo.completed;
      case Filters.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      showError(ERROR_MESSAGES.UNABLE_ADD_EMPTY);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const created = await addTodo(newTodo);

      setTodos(prev => [...prev, created]);
      setTitle('');
    } catch {
      showError(ERROR_MESSAGES.UNABLE_ADD);
    } finally {
      setTempTodo(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      showError(ERROR_MESSAGES.UNABLE_DELETE);
    } finally {
      setLoadingIds(prev => prev.filter(todo => todo !== id));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    await Promise.all(completed.map(todo => handleDelete(todo.id)));
  };

  const handleToggle = async (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);

    try {
      const updated = await updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prev =>
        prev.map(item => (item.id === todo.id ? updated : item)),
      );
    } catch {
      showError(ERROR_MESSAGES.UNABLE_UPDATE);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleRename = async (id: number, newTitle: string) => {
    const trimmed = newTitle.trim();

    try {
      setLoadingIds(prev => [...prev, id]);
      if (!trimmed) {
        await handleDelete(id);

        return;
      }

      const todoToUpdate = todos.find(todo => todo.id === id);

      if (!todoToUpdate) {
        throw new Error(ERROR_MESSAGES.UNABLE_LOAD);
      }

      const updated = await updateTodo({
        ...todoToUpdate,
        title: trimmed,
      });

      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));
    } catch {
      showError(ERROR_MESSAGES.UNABLE_UPDATE);
    } finally {
      setLoadingIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    const toUpdate = todos.filter(todo => todo.completed === allCompleted);

    await Promise.all(toUpdate.map(handleToggle));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hasTodos = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              type="button"
              data-cy="ToggleAllButton"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {hasTodos && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={handleDelete}
              onToggle={handleToggle}
              loadingIds={loadingIds}
              onRename={handleRename}
            />

            {tempTodo && <TodoList todos={[tempTodo]} loadingIds={[0]} />}
            <Footer
              todos={todos}
              filter={filter}
              setFilter={setFilter}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};
