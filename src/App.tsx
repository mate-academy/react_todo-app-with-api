import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoFooter } from './components/todoFooter/todoFooter';
import { TodoErr } from './components/todoErr/todoErr';
import { TodoForm } from './components/todoForm/todoForm';
import { TodoList } from './components/todoList/todoList';
import { USER_ID } from './utils/userID';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm />

        <TodoList />

        <TodoFooter />

      </div>

      <TodoErr />

    </div>
  );
};
