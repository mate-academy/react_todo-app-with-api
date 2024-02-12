/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { useTodoContext } from './context/TodoContext';

import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoList } from './components/TodoList/TodoList';
import { TodoForm } from './components/TodoForm/TodoForm';
import { NotificationModal } from './components/Notification/Notification';

export const App: React.FC = () => {
  const { todos, nrOfActiveTodos, toggleAll } = useTodoContext();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={
                cn('todoapp__toggle-all',
                  { active: nrOfActiveTodos === 0 })
              }
              aria-label="Toggle between active and not active"
              onClick={toggleAll}
            />
          )}

          <TodoForm />
        </header>

        <section className="todoapp__main">
          <TodoList />
        </section>

        {!!todos.length && (
          <TodoFooter />
        )}
      </div>

      <NotificationModal />
    </div>
  );
};
