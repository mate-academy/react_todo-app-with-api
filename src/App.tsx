import React, { useEffect, useRef, useState, useCallback } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import type { Todo } from './types/Todo';
import { Filter, FilterStatus } from './components/Filter';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { USER_ID } from './constants/user';
import { ErrorMessage } from './constants/errorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [pendingIds, setPendingIds] = useState<number[]>([]);

  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const hideErrorTimeoutIdRef = useRef<number | null>(null);

  const clearErrorTimer = useCallback(() => {
    if (hideErrorTimeoutIdRef.current) {
      window.clearTimeout(hideErrorTimeoutIdRef.current);
      hideErrorTimeoutIdRef.current = null;
    }
  }, []);

  const hideError = useCallback(() => {
    clearErrorTimer();
    setErrorMessage(null);
  }, [clearErrorTimer]);

  const showError = useCallback(
    (message: string) => {
      setErrorMessage(message);
      clearErrorTimer();
      hideErrorTimeoutIdRef.current = window.setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    },
    [clearErrorTimer],
  );

  useEffect(() => {
    newTodoInputRef.current?.focus();
    (async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch {
        showError(ErrorMessage.LoadFail);
      }
    })();

    return () => clearErrorTimer();
  }, [showError, clearErrorTimer]);

  const filteredTodos = getFilteredTodos(todos, filterStatus);
  const hasTodos = todos.length > 0;
  const activeTodosCount = todos.filter(t => !t.completed).length;
  const somePending = pendingIds.length > 0;

  const handleFilterChange = (nextStatus: FilterStatus) => {
    setFilterStatus(nextStatus);
  };

  const handleErrorClose = () => {
    hideError();
    setTimeout(() => newTodoInputRef.current?.focus(), 0);
  };

  const handleNewTodoFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      showError(ErrorMessage.EmptyTitle);
      return;
    }

    try {
      setIsAdding(true);
      setTempTodo({ id: 0, title: trimmed, completed: false, userId: USER_ID });
      const created = await createTodo(trimmed);
      setTodos(curr => [...curr, created]);
      setTitle('');
    } catch {
      showError(ErrorMessage.AddFail);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      setTimeout(() => newTodoInputRef.current?.focus(), 0);
    }
  };

  const pushPending = (id: number) =>
    setPendingIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  const popPending = (id: number) =>
    setPendingIds(prev => prev.filter(x => x !== id));

  const handleDelete = async (id: number) => {
    pushPending(id);
    try {
      await deleteTodo(id);
      setTodos(curr => curr.filter(t => t.id !== id));
    } catch {
      showError(ErrorMessage.DeleteFail);
    } finally {
      popPending(id);
      setTimeout(() => newTodoInputRef.current?.focus(), 0);
    }
  };

  const handleToggle = async (id: number, nextCompleted: boolean) => {
    pushPending(id);
    try {
      const updated = await updateTodo(id, { completed: nextCompleted });
      setTodos(curr =>
        curr.map(t =>
          t.id === id ? { ...t, completed: updated.completed } : t,
        ),
      );
    } catch {
      showError(ErrorMessage.UpdateFail);
    } finally {
      popPending(id);
    }
  };

  const handleRename = async (id: number, newTitle: string) => {
    const trimmed = newTitle.trim();

    if (trimmed.length === 0) {
      await handleDelete(id);
      return;
    }

    const original = todos.find(t => t.id === id);

    if (!original || original.title === trimmed) {
      return;
    }

    pushPending(id);
    try {
      const updated = await updateTodo(id, { title: trimmed });
      setTodos(curr =>
        curr.map(t => (t.id === id ? { ...t, title: updated.title } : t)),
      );
    } catch {
      showError(ErrorMessage.UpdateFail);
      throw new Error(ErrorMessage.UpdateFail);
    } finally {
      popPending(id);
    }
  };

  const handleToggleAll = async () => {
    if (!hasTodos) {
      return;
    }

    const targetCompleted = activeTodosCount > 0;
    const toChange = todos.filter(t => t.completed !== targetCompleted);

    if (toChange.length === 0) {
      return;
    }

    setPendingIds(prev =>
      Array.from(new Set([...prev, ...toChange.map(t => t.id)])),
    );

    const results = await Promise.allSettled(
      toChange.map(t => updateTodo(t.id, { completed: targetCompleted })),
    );

    const succeedIds: number[] = [];
    const failedIds: number[] = [];

    results.forEach((res, i) => {
      const id = toChange[i].id;

      if (res.status === 'fulfilled') {
        succeedIds.push(id);
      } else {
        failedIds.push(id);
      }
    });

    if (failedIds.length) {
      showError(ErrorMessage.UpdateFail);
    }

    if (succeedIds.length) {
      setTodos(curr =>
        curr.map(t =>
          succeedIds.includes(t.id) ? { ...t, completed: targetCompleted } : t,
        ),
      );
    }

    setPendingIds(prev => prev.filter(id => !toChange.some(t => t.id === id)));
  };

  const handleClearCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (completedIds.length === 0) {
      return;
    }

    setPendingIds(prev => Array.from(new Set([...prev, ...completedIds])));

    const results = await Promise.allSettled(
      completedIds.map(id => deleteTodo(id)),
    );

    const successIds: number[] = [];
    const failedIds: number[] = [];

    results.forEach((res, i) => {
      const id = completedIds[i];

      if (res.status === 'fulfilled') {
        successIds.push(id);
      } else {
        failedIds.push(id);
      }
    });

    if (failedIds.length) {
      showError(ErrorMessage.DeleteFail);
    }

    setTodos(curr => curr.filter(t => !successIds.includes(t.id)));
    setPendingIds(prev => prev.filter(id => !completedIds.includes(id)));
    setTimeout(() => newTodoInputRef.current?.focus(), 0);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              type="button"
              data-cy="ToggleAllButton"
              className={cn('todoapp__toggle-all', {
                active: activeTodosCount === 0 && hasTodos,
              })}
              onClick={handleToggleAll}
              disabled={somePending}
              aria-label="toggle all"
            />
          )}

          <form onSubmit={handleNewTodoFormSubmit}>
            <input
              ref={newTodoInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={({ target: { value } }) => setTitle(value)}
              disabled={isAdding || somePending}
              autoFocus
            />
          </form>
        </header>

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            pendingIds={pendingIds}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onRename={handleRename}
          />
        )}

        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <Filter value={filterStatus} onChange={handleFilterChange} />

            <button
              data-cy="ClearCompletedButton"
              className="todoapp__clear-completed"
              disabled={!todos.some(t => t.completed) || somePending}
              type="button"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Notification message={errorMessage} onClose={handleErrorClose} />
    </div>
  );
};
