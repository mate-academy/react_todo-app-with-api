/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useRef, useEffect,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from './contexts/TodoContext';
import { ErrorType } from './types/ErrorType';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const {
    todos,
    tempTodo,
    changeData,
    dataError,
    setError,
    Error,
    addTodo,
    inputValue,
    setInputValue,
    shouldFocus,
  } = useContext(TodoContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  let toggleActive = todos.every(currentTodo => currentTodo.completed);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [dataError, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              data-cy="ToggleAllButton"
              className={classNames(
                'todoapp__toggle-all',
                { active: todos.every(currentTodo => currentTodo.completed) },
              )}
              onClick={() => {
                toggleActive = !toggleActive;

                if (toggleActive) {
                  todos.forEach(currentTodo => {
                    if (currentTodo.completed === false) {
                      changeData(
                        currentTodo.id,
                        currentTodo.title,
                        true,
                      );
                    }
                  });
                }

                if (!toggleActive) {
                  todos.forEach(currentTodo => {
                    if (currentTodo.completed === true) {
                      changeData(
                        currentTodo.id,
                        currentTodo.title,
                        false,
                      );
                    }
                  });
                }
              }}
            />
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const value = inputValue.trim();

              return value.length > 0
                ? addTodo(value)
                : Error(ErrorType.Empty);
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              ref={inputRef}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {todos && (
          <TodoList />
        )}

        {(todos.length !== 0) && (
          <Footer />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !dataError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {dataError}
      </div>
    </div>
  );
};
