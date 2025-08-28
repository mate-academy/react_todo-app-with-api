// File: src/App.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import {
  USER_ID,
  Todo,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter, FilterBy } from './components/Filter/Filter';
import { UserWarning } from './components/UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const [isNewTodoLocked, setIsNewTodoLocked] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const showErrorMsg = (msg: string) => {
    setError(msg);
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = window.setTimeout(() => {
      setError(null);
    }, 3000) as unknown as number;
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setIsLoading(true);
      try {
        const data = await getTodos(USER_ID);

        if (isMounted) {
          setTodos(data);
        }
      } catch {
        if (isMounted) {
          showErrorMsg('Unable to load todos');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      if (errorTimerRef.current) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  // derived
  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case FilterBy.Active:
        return todos.filter(t => !t.completed);
      case FilterBy.Completed:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filterBy]);

  const hasCompleted = useMemo(() => todos.some(t => t.completed), [todos]);

  const allCompleted = useMemo(
    () => todos.length > 0 && todos.every(t => t.completed),
    [todos],
  );

  // DELETE
  const handleDelete = async (todo: Todo, suppressErrorClear = false) => {
    if (todo.id === 0) {
      return false;
    }

    if (!suppressErrorClear) {
      setError(null); // Hide error immediately on new request
    }

    setDeletingIds(prev => new Set(prev).add(todo.id));

    // Force React to flush state so loader appears before API call
    await new Promise(resolve => setTimeout(resolve, 0));

    let failed = false;

    try {
      await deleteTodo(todo.id);
      setTodos(prev => prev.filter(t => t.id !== todo.id));
    } catch {
      failed = true;
      if (!suppressErrorClear) {
        showErrorMsg('Unable to delete a todo');
      }
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);

        next.delete(todo.id);

        return next;
      });
      setTimeout(() => inputRef.current?.focus(), 0);
    }

    return !failed;
  };

  // CREATE
  const handleCreate = async (raw: string) => {
    setError(null); // Hide error immediately on new request
    setError(null); // Hide error immediately on new request
    const title = raw.trim();

    if (!title) {
      showErrorMsg('Title should not be empty');
      inputRef.current?.focus();

      // stay unlocked for the “keep focus when empty” test
      return;
    }

    // 🔒 lock the input immediately so it’s disabled BEFORE any response
    setIsNewTodoLocked(true);
    setCreating(true);

    // (optional) optimistic temp
    setTempTodo({ id: 0, userId: USER_ID, title, completed: false });

    // flush state so input disables before any await
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const created = await createTodo(USER_ID, { title, completed: false });

      setTodos(prev => [...prev, created]);
      setNewTitle('');
    } catch {
      showErrorMsg('Unable to add a todo');
    } finally {
      setCreating(false);
      setTempTodo(null);
      setIsNewTodoLocked(false); // 🔓 unlock when request settles
      inputRef.current?.focus();
    }
  };

  // CLEAR COMPLETED
  const handleClearCompleted = async () => {
    const targets = todos.filter(t => t.completed);
    let hadFailure = false;

    for (const t of targets) {
      const success = await handleDelete(t, true);

      if (!success) {
        hadFailure = true;
      }
    }

    // Show error once after all deletions if any failed
    if (hadFailure) {
      setError('Unable to delete a todo');
      if (errorTimerRef.current) {
        window.clearTimeout(errorTimerRef.current);
      }

      errorTimerRef.current = window.setTimeout(() => {
        setError(null);
      }, 3000) as unknown as number;
    }
  };

  // TOGGLE single
  const handleToggle = async (todo: Todo) => {
    setError(null); // Hide error immediately on new request
    if (todo.id === 0) {
      return;
    }

    setUpdatingIds(prev => new Set(prev).add(todo.id));

    // Force React to flush state so loader appears before API call
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const updated = await updateTodo(USER_ID, todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      showErrorMsg('Unable to update a todo');
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);

        next.delete(todo.id);

        return next;
      });
    }
  };

  // RENAME
  const handleRename = async (
    todo: Todo,
    newTitleRaw: string,
    done?: (success: boolean) => void,
  ) => {
    setError(null); // Hide error immediately on new request
    const updatedTitle = newTitleRaw.trim();

    // unchanged → cancel
    if (updatedTitle === todo.title.trim()) {
      if (done) {
        done(true);
      }

      return;
    }

    // empty → delete
    if (!updatedTitle) {
      const deleteSuccess = await handleDelete(todo);

      if (done) {
        done(deleteSuccess);
      }

      return;
    }

    if (todo.id === 0) {
      if (done) {
        done(true);
      }

      return;
    }

    setUpdatingIds(prev => new Set(prev).add(todo.id));
    // Force React to flush state so loader appears before API call
    await new Promise(resolve => setTimeout(resolve, 0));
    try {
      const updated = await updateTodo(USER_ID, todo.id, {
        title: updatedTitle,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
      if (done) {
        done(true);
      }
    } catch {
      showErrorMsg('Unable to update a todo');
      if (done) {
        done(false);
      }
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);

        next.delete(todo.id);

        return next;
      });
    }
  };

  // TOGGLE ALL
  const handleToggleAll = async () => {
    setError(null); // Hide error immediately on new request

    const shouldCompleteAll = !allCompleted;
    const toChange = todos.filter(t => t.completed !== shouldCompleteAll);

    setUpdatingIds(prev => {
      const next = new Set(prev);

      toChange.forEach(t => next.add(t.id));

      return next;
    });

    try {
      const results = await Promise.allSettled(
        toChange.map(todo =>
          updateTodo(USER_ID, todo.id, { completed: shouldCompleteAll }),
        ),
      );

      // apply successes
      const updatedById = new Map<number, Todo>();

      results.forEach((res, i) => {
        if (res.status === 'fulfilled') {
          updatedById.set(toChange[i].id, res.value);
        }
      });

      if (updatedById.size > 0) {
        setTodos(prev => prev.map(t => updatedById.get(t.id) ?? t));
      }

      // if any failed, notify once
      const hadFailure = results.some(r => r.status === 'rejected');

      if (hadFailure) {
        showErrorMsg('Unable to update a todo');
      }
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);

        toChange.forEach(t => next.delete(t.id));

        return next;
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoading && todos.length > 0 && (
            <button
              type="button"
              aria-label="Toggle all"
              data-cy="ToggleAllButton"
              className={cn('todoapp__toggle-all', { active: allCompleted })}
              onClick={handleToggleAll}
              disabled={todos.length === 0}
            />
          )}
          <NewTodo
            value={newTitle}
            disabled={creating || isNewTodoLocked}
            onChange={setNewTitle}
            onCreate={handleCreate}
            inputRef={inputRef}
            isEditing={isEditing}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingIds={deletingIds}
            updatingIds={updatingIds}
            onToggle={handleToggle}
            onRename={handleRename}
            onDelete={handleDelete}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </section>

        {todos.length > 0 && (
          <Filter
            filter={filterBy}
            setFilter={setFilterBy}
            activeCount={todos.filter(t => !t.completed).length}
            hasCompleted={hasCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <UserWarning
        isShown={!!error}
        message={error ?? ''}
        onClose={() => setError(null)}
      />

      {isLoading && (
        <div data-cy="Loader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
