/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/Error';
import { TodoProvider } from './TodosContext';
import { ErrorProvider } from './components/Error/ErrorMessageContext';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <ErrorProvider>
      <TodoProvider>
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header />
            <TodoList />
            <Footer />
          </div>

          <ErrorMessage />
        </div>
      </TodoProvider>
    </ErrorProvider>
  );
};
