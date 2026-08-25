/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessages } from './types/ErrorMessages';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { NewTodoField } from './components/NewTodoField';
import { filterTodos } from './utils/filterTodos';

const ERROR_DELAY = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<Status>(Status.All);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );

  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const newTodoField = useRef<HTMLInputElement>(null);

  const showError = (message: ErrorMessages) => {
    window.clearTimeout(errorTimerRef.current);
    setErrorMessage(message);

    errorTimerRef.current = setTimeout(() => {
      setErrorMessage(ErrorMessages.None);
    }, ERROR_DELAY);
  };

  const hideError = () => {
    window.clearTimeout(errorTimerRef.current);
    setErrorMessage(ErrorMessages.None);
  };

  useEffect(() => {
    hideError();

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessages.UnableToLoad));

    return () => window.clearTimeout(errorTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      newTodoField.current?.focus();
    }
  }, [isSubmitting]);

  const visibleTodos = useMemo(
    () => filterTodos(todos, status),
    [todos, status],
  );

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    hideError();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessages.EmptyTitle);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => showError(ErrorMessages.UnableToAdd))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
        newTodoField.current?.focus();
      });
  };

  // sends a PATCH request and syncs the result into state;
  // resolves to false (instead of rejecting) so callers can decide
  // whether to keep editing UI open without wrapping every call in try/catch
  const saveTodo = (todoId: number, data: Partial<Todo>): Promise<boolean> => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    return updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );

        return true;
      })
      .catch(() => {
        showError(ErrorMessages.UnableToUpdate);

        return false;
      })
      .finally(() => {
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  const removeTodo = (todoId: number): Promise<boolean> => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        return true;
      })
      .catch(() => {
        showError(ErrorMessages.UnableToDelete);

        return false;
      })
      .finally(() => {
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
        newTodoField.current?.focus();
      });
  };

  const handleDelete = (todoId: number) => {
    removeTodo(todoId);
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => removeTodo(todo.id));
  };

  const handleToggle = (todo: Todo) => {
    saveTodo(todo.id, { completed: !todo.completed });
  };

  const handleToggleAll = () => {
    const targetStatus = !allCompleted;

    todos
      .filter(todo => todo.completed !== targetStatus)
      .forEach(todo => saveTodo(todo.id, { completed: targetStatus }));
  };

  const handleRename = (todo: Todo, newTitle: string): Promise<boolean> => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      return Promise.resolve(true);
    }

    if (!trimmedTitle) {
      return removeTodo(todo.id);
    }

    return saveTodo(todo.id, { title: trimmedTitle });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <NewTodoField
            ref={newTodoField}
            title={title}
            onTitleChange={setTitle}
            onSubmit={handleSubmit}
            disabled={isSubmitting}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onRename={handleRename}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            onStatusChange={setStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onClose={hideError} />
    </div>
  );
};
