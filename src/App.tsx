/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem';
import { TodosContext } from './TodoContext';
import { Header, USER_ID } from './components/Header';
import { Footer } from './components/Footer';

export enum Key {
  Enter = 'Enter',
  Escape = 'Escape',
}

export const App: React.FC = () => {
  const {
    allTodos,
    tempTodo,
    filterBy,
    error,
    setError,
    filterTodos,
  } = useContext(TodosContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <section
          className="todoapp__main"
          data-cy="TodoList"
        >
          {filterTodos(allTodos, filterBy).map(todo => {
            return (
              <TodoItem key={todo.id} todo={todo} />
            );
          })}

          {tempTodo && <TodoItem todo={tempTodo} />}
        </section>

        <Footer />
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
