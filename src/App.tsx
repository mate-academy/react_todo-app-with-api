import React from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import ErrorNotification from './components/ErrorNotification';
import TodoFooter from './components/TodoFooter';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const { todos } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput />

        <TodoList />

        {todos.length > 0 && <TodoFooter />}
      </div>

      <ErrorNotification />
    </div>
  );
};
