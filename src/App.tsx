import React from 'react';
import { Error } from './Error';
import { Footer } from './Footer';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { TodoProvider } from './TodoContext';

export const App: React.FC = () => {
  return (
    <TodoProvider>
      <div className="todoapp">

        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header />
          <TodoList />
          <Footer />
        </div>

        <Error />
      </div>
    </TodoProvider>
  );
};
