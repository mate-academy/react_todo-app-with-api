/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FILTERS, FilterType } from './constants/filters';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { getFilteredTodos } from './utils/todoHelpers';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);
  const [, setNextId] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [focusTick, setFocusTick] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    setIsNotificationVisible(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsNotificationVisible(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setIsNotificationVisible(false);
      setErrorMessage('');

      try {
        const data = await getTodos();

        setTodos(data);
        const maxId = data.reduce(
          (max: number, t: { id: number }) => Math.max(max, t.id),
          0,
        );

        setNextId(maxId + 1);
      } catch (e) {
        if (e instanceof Error && e.message.trim() !== '') {
          showError(e.message);
        } else {
          showError('Unable to load todos');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getFilteredTodos(todos, filter);

  const allCompleted = todos.length > 0 && todos.every(t => t.completed);

  const handleToggle = async (id: number, nextCompleted: boolean) => {
    setUpdatingIds(prev => new Set(prev).add(id));

    try {
      const updatedTodo = await updateTodo(id, { completed: nextCompleted });

      setTodos(prev =>
        prev.map(t =>
          t.id === id ? { ...t, completed: updatedTodo.completed } : t,
        ),
      );
    } catch (e) {
      showError('Unable to update a todo');
    } finally {
      setUpdatingIds(prev => {
        const nextUpdatingIds = new Set(prev);

        nextUpdatingIds.delete(id);

        return nextUpdatingIds;
      });
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingIds(prev => new Set(prev).add(id));

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      showError('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => {
        const nextDeletingIds = new Set(prev);

        nextDeletingIds.delete(id);

        return nextDeletingIds;
      });
      setFocusTick(t => t + 1);
    }
  };

  const handleUpdateTitle = async (
    id: number,
    rawTitle: string,
  ): Promise<boolean> => {
    const title = rawTitle.trim();

    if (title === '') {
      await handleDelete(id);

      return false;
    }

    const currentTodo = todos.find(t => t.id === id);

    if (!currentTodo || currentTodo.title === title) {
      return true;
    }

    setUpdatingIds(prev => new Set(prev).add(id));

    try {
      const updatedTodo = await updateTodo(id, { title });

      setTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, title: updatedTodo.title } : t)),
      );

      return true;
    } catch (e) {
      showError('Unable to update a todo');

      return false;
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);

        next.delete(id);

        return next;
      });
    }
  };

  const handleToggleAll = async () => {
    if (todos.length === 0) {
      return;
    }

    const nextCompleted = !allCompleted;
    const todosToUpdate = todos
      .filter(t => t.completed !== nextCompleted)
      .map(t => t.id);

    if (todosToUpdate.length === 0) {
      return;
    }

    setUpdatingIds(prev => {
      const next = new Set(prev);

      todosToUpdate.forEach(id => next.add(id));

      return next;
    });

    const results = await Promise.allSettled(
      todosToUpdate.map(async id => {
        try {
          const updated = await updateTodo(id, { completed: nextCompleted });

          setTodos(prev =>
            prev.map(t =>
              t.id === id ? { ...t, completed: updated.completed } : t,
            ),
          );

          return { id, ok: true };
        } catch (e) {
          return { id, ok: false };
        } finally {
          setUpdatingIds(prev => {
            const next = new Set(prev);

            next.delete(id);

            return next;
          });
        }
      }),
    );

    const anyFailed = results.some(r =>
      r.status === 'fulfilled' ? !r.value.ok : true,
    );

    if (anyFailed) {
      showError('Unable to update a todo');
    }
  };

  const handleAdd = async (rawTitle: string): Promise<boolean> => {
    const title = rawTitle.trim();

    if (!title) {
      showError('Title should not be empty');

      return false;
    }

    setIsAdding(true);
    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    try {
      const created = await createTodo(title);

      setTodos(prev => [...prev, created]);

      return true;
    } catch (e) {
      showError('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleClearCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    if (completedIds.length === 0) {
      return;
    }

    setDeletingIds(prev => {
      const next = new Set(prev);

      completedIds.forEach(id => next.add(id));

      return next;
    });

    const results = await Promise.allSettled(
      completedIds.map(async id => {
        try {
          await deleteTodo(id);
          setTodos(prev => prev.filter(t => t.id !== id));

          return { id, ok: true };
        } catch (e) {
          return { id, ok: false };
        } finally {
          setDeletingIds(prev => {
            const next = new Set(prev);

            next.delete(id);

            return next;
          });
        }
      }),
    );

    const anyFailed = results.some(r =>
      r.status === 'fulfilled' ? !r.value.ok : true,
    );

    if (anyFailed) {
      showError('Unable to delete a todo');
    }

    setFocusTick(t => t + 1);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', { active: allCompleted })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <NewTodo
            disabled={isAdding}
            onSubmit={handleAdd}
            focusTick={focusTick}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {isLoading && (
            <div className="modal overlay is-active" data-cy="Loader">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}

          <TodoList
            todos={visibleTodos}
            loadingIds={
              new Set([...Array.from(deletingIds), ...Array.from(updatingIds)])
            }
            onDelete={handleDelete}
            onToggle={handleToggle}
            onUpdateTitle={handleUpdateTitle}
          />
          {tempTodo && (
            <TodoList
              todos={[tempTodo]}
              loadingIds={new Set([0])}
              onDelete={undefined}
            />
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <Filter currentFilter={filter} onChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(t => !t.completed)}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !isNotificationVisible },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsNotificationVisible(false)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
