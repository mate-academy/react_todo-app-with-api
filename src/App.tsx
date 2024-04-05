import React, { useEffect, useState } from 'react';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { USER_ID, postTodo, updateTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { useTodosContext } from './context/TodoContext';
import { ErrorList } from './types/ErrorList';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const {
    contextInputRef,
    focusInput,
    query,
    setQuery,
    todos,
    setTodos,
    errorMessage,
    handleError,
    setTempTodo,
  } = useTodosContext();

  const [isLoading, setIsLoading] = useState(false);
  const itemsLeft = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    focusInput();
  }, [isLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleQuerySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimedQuery = query.trim();

    if (!trimedQuery.length) {
      handleError(ErrorList.EmptyTitle);

      return;
    }

    setIsLoading(true);

    const newItem = {
      userId: USER_ID,
      title: trimedQuery,
      completed: false,
    };

    setTempTodo({ ...newItem, id: 0 });

    postTodo({ ...newItem })
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setQuery('');
      })
      .catch(() => {
        handleError(ErrorList.AddTodo);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleCheckAllFilter = (currentTodos: Todo[]) => {
    const updateTodoCompleted = currentTodos.map(currentTodo => {
      return {
        ...currentTodo,
        completed: !currentTodo.completed,
      };
    });

    const updatedMainTodos = todos.map(todo => {
      const updatedTodo = updateTodoCompleted.find(
        value => value.id === todo.id,
      );

      return updatedTodo ? updatedTodo : todo;
    });

    currentTodos.map(currentTodo => {
      const newTodo = {
        ...currentTodo,
        completed: !currentTodo.completed,
      };

      updateTodo(currentTodo.id, newTodo)
        .then(() => {
          setTodos(updatedMainTodos);
        })
        .catch(() => {
          handleError(ErrorList.UpdateTodo);
        })
        .finally(() => {
          focusInput();
          setIsLoading(false);
        });
    });
  };

  const handleCheckAll = async () => {
    setIsLoading(true);

    const filteredTodosByCompleted = todos.filter(todo => !todo.completed);

    if (filteredTodosByCompleted.length > 0) {
      handleCheckAllFilter(filteredTodosByCompleted);
    } else {
      handleCheckAllFilter(todos);
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const isClassActive = !!completedTodos.length && !activeTodos.length;

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
              onClick={() => handleCheckAll()}
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

        {!!todos.length && <Footer itemsLeft={itemsLeft} />}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
