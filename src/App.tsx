/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { useTodosContext } from './components/TodosContext';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const { todos, visibleTodos } = useTodosContext();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList todos={visibleTodos} />

        {!!todos.length && <Footer />}
      </div>

      <ErrorNotification />
    </div>
  );
};
