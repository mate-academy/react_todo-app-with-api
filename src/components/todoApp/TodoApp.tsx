import React from 'react';
import { TodoList } from './main/TodoList';
import { Footer } from './footer/footer';
import { Store } from './Store';
import { ErrorNotification } from './ErrorNotification';
import { TodoInput } from './header/TodoInput';

export const TodoApp: React.FC = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Store>
        <div className="todoapp__content">
          <TodoInput />
          <TodoList />
          <Footer />
          <ErrorNotification />
        </div>
      </Store>
    </div>
  );
};
