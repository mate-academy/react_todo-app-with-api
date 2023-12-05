/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { TodosContext, USER_ID } from './TodosContext';
import { UserWarning } from './UserWarning';

import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { Header } from './components/Header/Header';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const {
    todos,
    errorMessage,
    setErrorMessage,
    tempTodo,
  } = React.useContext(TodosContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!todos.length && (
          <>
            <TodoList />

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
              />
            )}

            <TodoFooter />
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
