/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useErrorMessage } from './hooks/ErrorMessage';
import { useTodos } from './hooks/useTodos';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { FilterType } from './types/Filter';

export const App: React.FC = () => {
  const {
    todos,
    isLoading,
    loadingIds,
    tempTodo,
    isClearing,
    fetchAllTodos,
    updateChecked,
    deleteTodo,
    postTodo,
    clearCompleted,
    handleToggleAll,
    updateTodoTitle,
  } = useTodos();
  const [fieldValue, setFieldValue] = useState('');
  const [errorMessage, setErrorMessage] = useErrorMessage();
  const [filter, setFilter] = useState<FilterType>(FilterType.all);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isDeleting = loadingIds.length > 0;

    if (!isLoading && tempTodo === null && !isDeleting && !isClearing) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isLoading, tempTodo, loadingIds, isClearing]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const load = async () => {
      try {
        await fetchAllTodos();
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      }
    };

    load();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const areAllCompleted = todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submit = async () => {
      try {
        await postTodo(fieldValue);
        setFieldValue('');
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      }
    };

    submit();
  };

  const handleUpdateChecked = async (todo: Todo) => {
    try {
      await updateChecked(todo);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleToggleAllButton = async () => {
    try {
      await handleToggleAll();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleClearCompleted = async () => {
    try {
      await clearCompleted();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  const changeFilter = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.active) {
      return !todo.completed;
    }

    if (filter === FilterType.completed) {
      return todo.completed;
    }

    return true;
  });

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
                active: areAllCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllButton}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              disabled={isLoading}
              data-cy="NewTodoField"
              type="text"
              value={fieldValue}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setFieldValue(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              updateChecked={() => handleUpdateChecked(todo)}
              deleteTodo={() => handleDeleteTodo(todo.id)}
              isLoading={loadingIds.includes(todo.id)}
              updateTodoTitle={updateTodoTitle}
              onError={setErrorMessage}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              updateChecked={() => {}}
              deleteTodo={() => {}}
              isLoading={true}
              updateTodoTitle={updateTodoTitle}
              onError={setErrorMessage}
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        <Footer
          todos={todos}
          clearCompleted={handleClearCompleted}
          changeFilter={changeFilter}
          filter={filter}
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
