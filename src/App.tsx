import React, { useEffect, useRef, useState } from 'react';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { USER_ID, postTodo, updateTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { useTodosContext } from './context/TodoContext';
import { ErrorMessages } from './types/ErrorMessages';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const {
    query,
    setQuery,
    todos,
    setTodos,
    errorMessage,
    handleError,
    setTempTodo,
    processingIds,
  } = useTodosContext();

  const [isLoading, setIsLoading] = useState(false);
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const isClassActive = !!completedTodos.length && !activeTodos.length;

  const contextInputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => {
    contextInputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, [todos.length, processingIds.length, isLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleQuerySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimedQuery = query.trim();

    if (!trimedQuery.length) {
      handleError(ErrorMessages.EmptyTitle);

      return;
    }

    setIsLoading(true);

    const newItem = {
      userId: USER_ID,
      title: trimedQuery,
      completed: false,
    };

    setTempTodo({ ...newItem, id: 0 });

    postTodo(newItem)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setQuery('');
      })
      .catch(() => {
        handleError(ErrorMessages.AddTodo);
        contextInputRef.current?.focus();
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const toggleAllTodosCompletionStatus = (currentTodos: Todo[]) => {
    currentTodos.forEach(currentTodo => {
      const newTodo = {
        ...currentTodo,
        completed: !currentTodo.completed,
      };

      updateTodo(currentTodo.id, newTodo)
        .then(updatedTodo => {
          setTodos(prevTodos =>
            prevTodos.map(prevTodo =>
              prevTodo.id === updatedTodo.id ? updatedTodo : prevTodo,
            ),
          );
        })
        .catch(() => {
          handleError(ErrorMessages.UpdateTodo);
        })
        .finally(() => {
          focusInput();
          setIsLoading(false);
        });
    });
  };

  const handleCheckAll = () => {
    setIsLoading(true);

    if (activeTodos.length > 0) {
      toggleAllTodosCompletionStatus(activeTodos);
    } else {
      toggleAllTodosCompletionStatus(todos);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isClassActive,
              })}
              data-cy="ToggleAllButton"
              onClick={handleCheckAll}
            />
          )}

          <form onSubmit={handleQuerySubmit}>
            <input
              ref={contextInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleQueryChange}
              disabled={isLoading}
            />
          </form>
        </header>

        <TodoList />

        {!!todos.length && <Footer itemsLeft={activeTodos} />}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
