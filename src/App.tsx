import React from 'react';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { useTodos } from './TodosContext';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const { todos } = useTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />
        <TodoList />
        {!!todos.length && <TodoFooter />}
      </div>

      <Error />
    </div>
  );
};
