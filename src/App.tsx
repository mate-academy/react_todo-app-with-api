/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { TodoContext } from './components/TodoContext';
import { Notification } from './components/Notification';
import { TodoForm } from './components/TodoForm';

export const App: React.FC = () => {
  const { todos, USER_ID, errorMessage } = useContext(TodoContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoForm />
        <TodoList />
        {!!todos.length && <Footer />}
      </div>
      {errorMessage && <Notification />}
    </div>
  );
};
