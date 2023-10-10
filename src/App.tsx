/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodosProvider } from './TodosContext/TodosContext';
import { ErrorsNotifications } from './components/ErrorsNotifications';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header />

          <TodoList />

          <Footer />
        </div>

        <ErrorsNotifications />
      </div>
    </TodosProvider>
  );
};
