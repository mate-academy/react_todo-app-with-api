/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import classNames from 'classnames';

import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { TodoItem } from './components/TodoItem';
import { TodosContext } from './TodosContext';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const {
    todos,
    tempTodo,
    errorMessage,
    setError,
    handlerClearCompletedTodos,
    activeTodos,
    toggleAll,
  } = useContext(TodosContext);

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

          <NewTodo />
        </header>
        {todos.length > 0 && (
          <>
            <TodoList />

            {tempTodo && (
              <TodoItem todo={tempTodo} />
            )}

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {`${activeTodos} items left`}
                </span>

                <Filter />

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  disabled={activeTodos === todos.length}
                  onClick={handlerClearCompletedTodos}
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
          onClick={() => setError(Errors.None)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
