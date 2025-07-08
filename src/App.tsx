/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header';
import { ToDoList } from './components/ToDoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { useTodosContext } from './context/TodoContextProvider';

export const App: React.FC = () => {
  const context = useTodosContext();

  if (!USER_ID) {
    return <UserWarning />;
  }

  const { todos } = context;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header hasTodos={todos.length > 0} />

        {todos.length > 0 && <ToDoList />}

        {todos.length > 0 && <Footer />}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification />
    </div>
  );
};
