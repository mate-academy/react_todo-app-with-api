/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import * as TodoRequests from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoNew } from './components/TodoNew';
import { TodoFilter } from './components/TodoFilter';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11693;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [statusResponse, setStatusResponse] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdating, setIsUpdating] = useState<number[]>([]);

  function setError(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  useEffect(() => {
    setIsLoading(true);

    TodoRequests.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Errors.LOADING))
      .finally(() => setIsLoading(false));
  }, []);

  const visibleTodos = useMemo(() => {
    let preparedTodos = [...todos];

    preparedTodos = preparedTodos.filter((todo) => {
      switch (currentFilter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        case Filter.All:
        default:
          return true;
      }
    });

    return preparedTodos;
  }, [todos, currentFilter]);

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  const addTodo = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(Errors.TITLE);

      return;
    }

    const data = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...data,
    });

    setStatusResponse(true);

    TodoRequests.createTodo(data)
      .then((newTodo) => {
        setTitle('');
        setTodos((currentTodo) => [...currentTodo, newTodo]);
      })
      .catch(() => setError(Errors.ADD))
      .finally(() => {
        setTempTodo(null);
        setStatusResponse(false);
      });
  };

  const updateTodo = (newTodo: Todo) => {
    setIsUpdating(current => [...current, newTodo.id]);
    setStatusResponse(true);

    return TodoRequests.updateTodo(newTodo)
      .then(() => {
        setTodos(current => current
          .map(curTodo => (curTodo.id === newTodo.id ? newTodo : curTodo)));
      })
      .catch((error) => {
        setError(Errors.UPDATE);
        throw error;
      })
      .finally(() => {
        setIsUpdating(current => current.filter(id => id !== newTodo.id));
        setStatusResponse(false);
      });
  };

  const toggleTodo = (todo: Todo) => {
    const { completed } = todo;

    const newTodo = {
      ...todo,
      completed: !completed,
    };

    updateTodo(newTodo)
      .then(() => { })
      .catch(() => { });
  };

  const toggleAll = () => {
    const completedStatus = activeTodos > 0;

    todos.forEach(todo => {
      if (todo.completed !== completedStatus) {
        toggleTodo(todo);
      }
    });
  };

  const deleteTodo = (todoId: number) => {
    setStatusResponse(true);
    setIsUpdating(current => [...current, todoId]);

    TodoRequests.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
        setStatusResponse(false);
      })
      .catch(() => setError(Errors.DELETE))
      .finally(() => {
        setIsUpdating(current => current
          .filter(id => id !== todoId));
      });
  };

  const handleClearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => Promise.resolve(deleteTodo(todo.id)));

    Promise.allSettled(completedTodos);
  };

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
                active: !activeTodos,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <TodoNew
            title={title}
            setTitle={setTitle}
            statusResponse={statusResponse}
            addTodo={addTodo}
          />
        </header>

        {!isLoading && (
          <>
            <TodoList
              todos={visibleTodos}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              isUpdating={isUpdating}
              updateTodo={updateTodo}
            />

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                isUpdating={isUpdating}
                updateTodo={updateTodo}
              />
            )}

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {`${activeTodos} items left`}
                </span>

                <TodoFilter
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                />

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  disabled={activeTodos === todos.length}
                  onClick={handleClearCompletedTodos}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
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
