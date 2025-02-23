import React from 'react';
import { Store } from './TodosContext/TodosContext';
import { TodoInput } from './Header/Header';
import { TodoList } from './Body/TodoList';
import { Footer } from './Footer/Footer';
import { ErrorNotification } from './ErrorComponent/Error';

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
