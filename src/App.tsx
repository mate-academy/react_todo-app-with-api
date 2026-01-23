/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import classNames from 'classnames';
import { TodoItem } from './components/TodoItem';
import { FilterType } from './types/FilterType';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  // #region state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages | ''>('');
  const [hasErrorMessage, setHasErrorMessage] = useState(false);
  const [filter, setFilter] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [togglingTodoId, setTogglingTodoId] = useState<number | null>(null);
  const [renamingTodoId, setRenamingTodoId] = useState<number | null>(null);

  //#endregion

  // #region loadTodos
  function loadTodos() {
    setError('');
    setHasErrorMessage(false);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessages.UnableToLoad);
        setHasErrorMessage(true);
        setTimeout(() => {
          setHasErrorMessage(false);
        }, 3000);
      });
  }
  //#endregion

  useEffect(loadTodos, []);

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosLength = todos.filter(todo => !todo.completed).length;
  const completedTodosLength = todos.filter(todo => todo.completed).length;

  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus();
  }, [submitting]);

  const addTodo = async (newTitle: string) => {
    const newTodo = await todoService.addTodos({ title: newTitle });

    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  // #region deleteTodo
  function deleteTodo(todoId: number) {
    setDeletingTodoId(todoId);

    setSubmitting(true);

    todoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(ErrorMessages.UnableToDelete);
        setHasErrorMessage(true);
        setTimeout(() => {
          setHasErrorMessage(false);
        }, 3000);
      })
      .finally(() => {
        setDeletingTodoId(null);
        setSubmitting(false);
      });
  }
  //#endregion

  // #region clearCompleted
  const clearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setSubmitting(true);

    try {
      const results = await Promise.allSettled(
        completedIds.map(id => todoService.deleteTodos(id)),
      );

      const fulfilledIds = completedIds.filter(
        (_, i) => results[i].status === 'fulfilled',
      );

      setTodos(current =>
        current.filter(todo => !fulfilledIds.includes(todo.id)),
      );

      if (results.some(result => result.status === 'rejected')) {
        setError(ErrorMessages.UnableToDelete);
        setHasErrorMessage(true);
        setTimeout(() => setHasErrorMessage(false), 3000);
      }
    } finally {
      setSubmitting(false);
    }
  };
  //#endregion

  const togglingTodo = async (todo: Todo) => {
    setSubmitting(true);
    setTogglingTodoId(todo.id);

    const todoToUpdate = {
      ...todo,
      completed: !todo.completed,
    };

    try {
      const updatedTodo: Todo = await todoService.updateTodos(todoToUpdate);

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
      );
    } catch {
      setError(ErrorMessages.UnableToUpdate);
      setHasErrorMessage(true);

      setTimeout(() => {
        setHasErrorMessage(false);
      }, 3000);
    } finally {
      setTogglingTodoId(null);
      setSubmitting(false);
    }
  };

  const togglingAll = async () => {
    if (
      activeTodosLength === todos.length ||
      completedTodosLength === todos.length
    ) {
      todos.map(todo => {
        togglingTodo(todo);
      });
    }

    todos.map(todo => {
      if (todo.completed === false) {
        togglingTodo(todo);
      }
    });
  };

  // #region handleRename
  const handleRename = async (id: number, newTitle: string) => {
    if (id === null) {
      return false;
    }

    const trimmed = newTitle.trim();

    if (!trimmed) {
      deleteTodo(id);

      return false;
    }

    const todoToUpdate = todos.find(t => t.id === id);

    if (!todoToUpdate) {
      return false;
    }

    if (todoToUpdate.title === trimmed) {
      return true;
    }

    setSubmitting(true);
    setRenamingTodoId(id);

    try {
      const updatedTodo = await todoService.updateTodos({
        ...todoToUpdate,
        title: trimmed,
      });

      setTodos(current =>
        current.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
      );

      return true;
    } catch (e) {
      setError(ErrorMessages.UnableToUpdate);
      setHasErrorMessage(true);

      setTimeout(() => {
        setHasErrorMessage(false);
      }, 3000);

      return false;
    } finally {
      setSubmitting(false);
      setRenamingTodoId(null);
    }
  };
  //#endregion

  // #region handleSubmit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessages.TitleNotEmpty);
      setHasErrorMessage(true);
      setTimeout(() => {
        setHasErrorMessage(false);
      }, 3000);
      setSubmitting(false);
      field.current?.focus();

      return;
    }

    setSubmitting(true);

    const tempedTodo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(tempedTodo);

    try {
      await addTodo(trimmedTitle);
      setTitle('');
    } catch (e) {
      setError(ErrorMessages.UnableToAdd);
      setHasErrorMessage(true);
      setTimeout(() => {
        setHasErrorMessage(false);
      }, 3000);
    } finally {
      setTempTodo(null);
      setSubmitting(false);
    }
  };
  //#endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active:
                  completedTodosLength === todos.length && completedTodosLength,
              })}
              data-cy="ToggleAllButton"
              onClick={togglingAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={field}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={submitting}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              isLoading={
                deletingTodoId === todo.id ||
                togglingTodoId === todo.id ||
                renamingTodoId === todo.id
              }
              onToggle={togglingTodo}
              onRename={handleRename}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              onDelete={deleteTodo}
              isLoading={true}
              onToggle={togglingTodo}
              onRename={handleRename}
            />
          )}
        </section>

        {!!todos.length && (
          <Footer
            filtered={filter}
            onFiltered={setFilter}
            activeTodos={activeTodosLength}
            completeTodos={completedTodosLength}
            onClearCompletedTodos={clearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !hasErrorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setHasErrorMessage(false)}
        />
        {error}
      </div>
    </div>
  );
};
