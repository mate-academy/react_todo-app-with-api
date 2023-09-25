import React from 'react';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodosContextProvider } from './TodosContext';
import { Error } from './components/Error';

export const App: React.FC = () => {
  return (
    <div className="todoapp">
      <TodosContextProvider>
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoHeader />
          <TodoList />
          <TodoFooter />
        </div>

        <Error />
      </TodosContextProvider>
    </div>
  );
};
