import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { ErrorNotification } from './ErrorNotification';
import { Footer } from './Footer';
import { Header } from './Header';
import { TodoList } from './TodoList';

export const TodoApp: React.FC = () => {
  const { error } = useContext(TodoContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <section className="todoapp__main" data-cy="TodoList">
          <TodoList />
        </section>

        <Footer />
      </div>

      <ErrorNotification error={error} />
    </div>
  );
};
