import React, { useEffect, useState, useRef, useCallback } from 'react';
import classNames from 'classnames';

import { Header } from './components/header';
import { TodoList } from './components/todolist';
import { Footer } from './components/footer';
import { ErrorNotification } from './components/error';

import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { Todo } from './types/todo';
import { FilterType } from './enums/filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const [savingIds, setSavingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const hideErrorTimer = useRef<number | null>(null);

  const clearError = useCallback(() => {
    if (hideErrorTimer.current !== null) {
      window.clearTimeout(hideErrorTimer.current);
      hideErrorTimer.current = null;
    }

    setErrorMsg(null);
  }, []);

  const showError = useCallback((msg: string) => {
    setErrorMsg(msg);
    if (hideErrorTimer.current !== null) {
      window.clearTimeout(hideErrorTimer.current);
    }

    hideErrorTimer.current = window.setTimeout(() => {
      setErrorMsg(null);
      hideErrorTimer.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (hideErrorTimer.current !== null) {
        window.clearTimeout(hideErrorTimer.current);
      }
    };
  }, []);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const data = await getTodos();

      setTodos(data);
    } catch {
      showError('Unable to load todos');
    } finally {
      setLoading(false);
    }
  }, [clearError, showError]);

  useEffect(() => {
    if (USER_ID) {
      loadTodos();
    }

    inputRef.current?.focus();
  }, [loadTodos]);

  useEffect(() => {
    if (!tempTodo) {
      return;
    }

    const exists = todos.some(t => t.id === tempTodo.id);

    if (exists) {
      setTempTodo(null);
    }
  }, [todos, tempTodo]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const hasTodos = todos.length > 0;
  const allCompleted = hasTodos && todos.every(t => t.completed);

  const handleAddTodo = async (title: string): Promise<boolean> => {
    const trimmed = title.trim();

    if (!trimmed) {
      showError('Title should not be empty');

      return false;
    }

    clearError();

    const optimisticTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(optimisticTodo);

    try {
      const created = await addTodo(trimmed);

      setTodos(prev => [...prev, created]);

      return true;
    } catch {
      showError('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    clearError();
    setSavingIds(ids => [...ids, todo.id]);
    try {
      const updated = await updateTodo({ ...todo, completed: !todo.completed });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setSavingIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  const handleRemoveTodo = async (id: number): Promise<boolean> => {
    clearError();
    setSavingIds(ids => [...ids, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      inputRef.current?.focus();

      return true;
    } catch {
      showError('Unable to delete a todo');

      return false;
    } finally {
      setSavingIds(ids => ids.filter(x => x !== id));
    }
  };

  const handleUpdateTitle = async (
    id: number,
    nextTitle: string,
  ): Promise<boolean> => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return false;
    }

    const trimmed = nextTitle.trim();

    if (trimmed === '') {
      const ok = await handleRemoveTodo(id);

      return ok;
    }

    if (trimmed === todo.title) {
      return true;
    }

    clearError();
    setSavingIds(ids => [...ids, id]);

    try {
      const updated = await updateTodo({ ...todo, title: trimmed });

      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));

      return true;
    } catch {
      showError('Unable to update a todo');

      return false;
    } finally {
      setSavingIds(ids => ids.filter(x => x !== id));
    }
  };

  const handleToggleAll = async () => {
    if (todos.length === 0) {
      return;
    }

    clearError();

    const shouldCompleteAll = todos.some(t => !t.completed);
    const toChange = todos.filter(t => t.completed !== shouldCompleteAll);

    if (toChange.length === 0) {
      return;
    }

    const ids = toChange.map(t => t.id);

    const prevTodos = todos;

    setTodos(prev =>
      prev.map(t =>
        ids.includes(t.id) ? { ...t, completed: shouldCompleteAll } : t,
      ),
    );
    setSavingIds(prev => Array.from(new Set([...prev, ...ids])));

    const results = await Promise.allSettled(
      toChange.map(t => updateTodo({ ...t, completed: shouldCompleteAll })),
    );

    const failedIds = results
      .map((r, i) => (r.status === 'rejected' ? ids[i] : null))
      .filter((x): x is number => x !== null);

    if (failedIds.length) {
      setTodos(prev =>
        prev.map(t =>
          failedIds.includes(t.id) ? prevTodos.find(p => p.id === t.id)! : t,
        ),
      );
      showError('Unable to update a todo');
    }

    setSavingIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleClearCompleted = async () => {
    clearError();

    const completed = todos.filter(t => t.completed);

    if (completed.length === 0) {
      return;
    }

    const ids = completed.map(t => t.id);

    setSavingIds(prev => Array.from(new Set([...prev, ...ids])));

    const results = await Promise.allSettled(
      completed.map(t => deleteTodo(t.id)),
    );

    const succeededIds: number[] = [];
    let hasFail = false;

    results.forEach((res, i) => {
      if (res.status === 'fulfilled') {
        succeededIds.push(ids[i]);
      } else {
        hasFail = true;
      }
    });

    if (succeededIds.length) {
      setTodos(prev => prev.filter(t => !succeededIds.includes(t.id)));
    }

    if (hasFail) {
      showError('Unable to delete a todo');
    }

    setSavingIds(prev => prev.filter(id => !ids.includes(id)));

    inputRef.current?.focus();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={hasTodos}
          allCompleted={allCompleted}
          onToggleAll={handleToggleAll}
          onAddTodo={handleAddTodo}
          inputRef={inputRef}
          disabled={!!tempTodo}
        />

        {(hasTodos || tempTodo) && (
          <>
            <TodoList
              todos={[...filteredTodos, ...(tempTodo ? [tempTodo] : [])]}
              savingIds={savingIds}
              onToggleTodo={handleToggleTodo}
              onRemoveTodo={handleRemoveTodo}
              onUpdateTitle={handleUpdateTitle}
              tempTodoId={tempTodo ? 0 : null}
            />

            <Footer
              activeCount={activeCount}
              completedCount={completedCount}
              filter={filter}
              setFilter={setFilter}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}

        <ErrorNotification
          errorMsg={errorMsg}
          onClose={() => setErrorMsg(null)}
        />

        <div
          data-cy="LoadingOverlay"
          className={classNames('modal overlay', { 'is-active': loading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </div>
  );
};
