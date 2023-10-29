import React, { useContext } from 'react';
import { UserWarning } from './components/UserWarning/UserWarning';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoContext, USER_ID } from './context/TodoContext';

export const App: React.FC = () => {
  const { todos } = useContext(TodoContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />
        <TodoList />
        {!!todos.length && (
          <TodoFooter />
        )}
      </div>
      <ErrorMessage />
    </div>
  );
};
