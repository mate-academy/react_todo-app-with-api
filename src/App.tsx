import React, { useContext } from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrorNotification } from './components/TodoErrorNotification';
import { GlobalContext } from './TodoContext';

export const App: React.FC = () => {
  const { state } = useContext(GlobalContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        {state.todos.length > 0
          && (
            <>
              <TodoList />
              <TodoFooter />
            </>
          )}
      </div>

      <TodoErrorNotification />
    </div>
  );
};
