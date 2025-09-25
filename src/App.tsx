/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
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

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  // state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const editingProcessingRef = useRef(false);

  const newTodoRef = useRef<HTMLInputElement | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const errorTimerRef = useRef<number | null>(null);

  const modalBackgroundClass = 'modal-background has-background-white-ter';

  function showError(msg: string) {
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
    }

    setError(msg);
    errorTimerRef.current = window.setTimeout(() => setError(null), 3000);
  }

  // Cancel editing helper (defined early to satisfy ESLint no-use-before-define)
  function cancelEditing() {
    setEditingId(null);
    setEditingText('');
  }

  async function loadTodos() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTodos();

      setTodos(data);
    } catch {
      showError('Unable to load todos');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace('#', '') || '/';

      if (h === '/' || h === '') {
        setFilter('all');
      } else if (h.includes('active')) {
        setFilter('active');
      } else if (h.includes('completed')) {
        setFilter('completed');
      }
    };

    window.addEventListener('hashchange', onHashChange);
    onHashChange();

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    loadTodos();
    setTimeout(() => newTodoRef.current?.focus(), 0);

    return () => {
      if (errorTimerRef.current) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // focus edit input when editingId changes
  useEffect(() => {
    if (editingId !== null) {
      setTimeout(() => editInputRef.current?.focus(), 0);
    }
  }, [editingId]);

  // ADD
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const input = newTodoRef.current;
    const raw = input?.value ?? '';
    const title = raw.trim();

    if (!title) {
      showError('Title should not be empty');
      input?.focus();

      return;
    }

    if (input) {
      input.disabled = true;
    }

    setError(null);

    const temp: Todo = { id: 0, userId: USER_ID, title, completed: false };

    setTempTodo(temp);

    try {
      const created = await addTodo(title);

      setTodos(prev => [...prev, created]);
      setTempTodo(null);
      if (input) {
        input.value = '';
      }
    } catch {
      showError('Unable to add a todo');
      setTempTodo(null);
    } finally {
      if (input) {
        input.disabled = false;
        setTimeout(() => input.focus(), 0);
      }
    }
  }

  // generic update helper
  async function performUpdate(id: number, data: Partial<Todo>) {
    setSavingIds(s => {
      const copy = new Set(s);

      copy.add(id);

      return copy;
    });
    setError(null);

    try {
      const updated = await updateTodo(id, data);

      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setSavingIds(s => {
        const copy = new Set(s);

        copy.delete(id);

        return copy;
      });
    }
  }

  // toggle single
  async function toggleTodo(id: number, completed: boolean) {
    await performUpdate(id, { completed });
  }

  // toggle all - skip item currently in edit
  async function handleToggleAll() {
    const allCompleted = todos.length > 0 && todos.every(t => t.completed);
    const target = !allCompleted;
    const toUpdate = todos.filter(
      t => t.id !== editingId && t.completed !== target,
    );

    if (toUpdate.length === 0) {
      return;
    }

    setError(null);
    setSavingIds(s => {
      const copy = new Set(s);

      toUpdate.forEach(t => copy.add(t.id));

      return copy;
    });

    try {
      for (const t of toUpdate) {
        // eslint-disable-next-line no-await-in-loop
        const updated = await updateTodo(t.id, { completed: target });

        setTodos(prev => prev.map(p => (p.id === t.id ? updated : p)));
      }
    } catch {
      showError('Unable to update a todo');
    } finally {
      setSavingIds(s => {
        const copy = new Set(s);

        toUpdate.forEach(t => copy.delete(t.id));

        return copy;
      });
    }
  }

  // delete
  async function handleDelete(id: number) {
    setSavingIds(s => {
      const copy = new Set(s);

      copy.add(id);

      return copy;
    });
    setError(null);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setSavingIds(s => {
        const copy = new Set(s);

        copy.delete(id);

        return copy;
      });
      setTimeout(() => newTodoRef.current?.focus(), 0);
    }
  }

  // clear completed
  async function handleClearCompleted() {
    const completed = todos.filter(t => t.completed);

    if (completed.length === 0) {
      return;
    }

    setError(null);
    setSavingIds(s => {
      const copy = new Set(s);

      completed.forEach(t => copy.add(t.id));

      return copy;
    });

    const promises = completed.map(t =>
      deleteTodo(t.id)
        .then(() => ({ id: t.id, ok: true }))
        .catch(() => ({ id: t.id, ok: false })),
    );

    const results = await Promise.all(promises);
    const failed = results.some(r => !r.ok);

    if (failed) {
      showError('Unable to delete a todo');
    }

    const succeeded = results.filter(r => r.ok).map(r => r.id);

    if (succeeded.length) {
      setTodos(prev => prev.filter(t => !succeeded.includes(t.id)));
    }

    setSavingIds(s => {
      const copy = new Set(s);

      completed.forEach(t => copy.delete(t.id));

      return copy;
    });

    setTimeout(() => newTodoRef.current?.focus(), 0);
  }

  // editing
  function startEditing(t: Todo) {
    setEditingId(t.id);
    setEditingText(t.title);
  }

  async function finishEditing(t: Todo) {
    if (editingProcessingRef.current) {
      return;
    }

    editingProcessingRef.current = true;

    const newTitle = editingText.trim();

    try {
      // unchanged -> just cancel editing
      if (newTitle === t.title) {
        cancelEditing();

        return;
      }

      // empty -> try to delete while editor remains open and show loader
      if (newTitle === '') {
        setSavingIds(s => {
          const copy = new Set(s);

          copy.add(t.id);

          return copy;
        });
        setError(null);

        try {
          await deleteTodo(t.id);
          // deleted successfully -> remove and focus main input
          setTodos(prev => prev.filter(it => it.id !== t.id));
          cancelEditing();
          setTimeout(() => newTodoRef.current?.focus(), 0);
        } catch {
          // deletion failed -> keep editor open, clear loader, show error and focus editor
          showError('Unable to delete a todo');
          setEditingId(t.id);
          setEditingText('');
          setTimeout(() => editInputRef.current?.focus(), 0);
        } finally {
          setSavingIds(s => {
            const copy = new Set(s);

            copy.delete(t.id);

            return copy;
          });
        }

        return;
      }

      // Normal rename: keep editor visible while updating and show per-item loader
      setSavingIds(s => {
        const copy = new Set(s);

        copy.add(t.id);

        return copy;
      });
      setError(null);

      try {
        const updated = await updateTodo(t.id, { title: newTitle });

        setTodos(prev => prev.map(it => (it.id === t.id ? updated : it)));
        cancelEditing();
        setTimeout(() => newTodoRef.current?.focus(), 0);
      } catch {
        // update failed -> keep editor open and show error
        showError('Unable to update a todo');
        setEditingId(t.id);
        setEditingText(newTitle);
        setTimeout(() => editInputRef.current?.focus(), 0);
      } finally {
        setSavingIds(s => {
          const copy = new Set(s);

          copy.delete(t.id);

          return copy;
        });
      }
    } finally {
      editingProcessingRef.current = false;
    }
  }

  const visibleTodos = todos.filter(t =>
    filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed,
  );

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const allCompleted = todos.length > 0 && activeCount === 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* render toggle-all only when there is at least one todo */}
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              disabled={todos.length === 0 || isLoading}
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAdd}>
            <input
              ref={newTodoRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={Boolean(tempTodo)}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(t => {
              const isSaving = savingIds.has(t.id);
              const isEditing = editingId === t.id;

              return (
                <div
                  key={t.id}
                  data-cy="Todo"
                  className={`todo ${t.completed ? 'completed' : ''}`}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={t.completed}
                      onChange={e => toggleTodo(t.id, e.target.checked)}
                      disabled={isSaving || isEditing}
                    />
                  </label>

                  {!isEditing && (
                    <>
                      <span
                        data-cy="TodoTitle"
                        className="todo__title"
                        onDoubleClick={() => startEditing(t)}
                      >
                        {t.title}
                      </span>

                      <button
                        type="button"
                        className="todo__remove"
                        data-cy="TodoDelete"
                        onClick={() => handleDelete(t.id)}
                        disabled={isSaving}
                      >
                        ×
                      </button>
                    </>
                  )}

                  {isEditing && (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        void finishEditing(t);
                      }}
                      className="todo__edit-form"
                    >
                      <input
                        ref={editInputRef}
                        data-cy="TodoTitleField"
                        role="textbox"
                        className="todo__title-edit"
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        onBlur={() => {
                          void finishEditing(t);
                        }}
                        onKeyUp={e => {
                          if (e.key === 'Escape') {
                            cancelEditing();
                            setTimeout(() => newTodoRef.current?.focus(), 0);
                          }
                        }}
                        autoFocus
                      />
                    </form>
                  )}

                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${isSaving ? 'is-active' : ''}`}
                  >
                    <div className={modalBackgroundClass}></div>
                    <div className="loader" />
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* tempTodo shown AFTER the list while POST is pending */}
        {tempTodo && (
          <section className="todoapp__main" aria-hidden>
            <div className="todo" data-cy="Todo">
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                  readOnly
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                disabled
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className={modalBackgroundClass}></div>
                <div className="loader" />
              </div>
            </div>
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedCount === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            if (errorTimerRef.current) {
              window.clearTimeout(errorTimerRef.current);
            }

            setError(null);
          }}
        />
        {error && <>{error}</>}
      </div>
    </div>
  );
};
