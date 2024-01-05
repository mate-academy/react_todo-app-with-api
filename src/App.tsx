/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { Notification } from './components/Notification/Notification';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { StateContext } from './TodosContext';

export const App: React.FC = () => {
  const { todos } = useContext(StateContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {!!todos.length && (
          <Footer />
        )}
      </div>

      <Notification />
    </div>
  );
};
