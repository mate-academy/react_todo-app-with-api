/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { USER_ID } from './constants/credentials';
import { TodoContext } from './contexts/TodoContext';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export const App: React.FC = () => {
  const { todos } = useContext(TodoContext);

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
            <Footer />
          </>
        )}
      </div>

      <ErrorMessage />
    </div>
  );
};
