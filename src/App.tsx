import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { ToDoHeader } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Error/Error';
import { useTodoContext } from './context/TodoProvider';

export const App: React.FC = () => {
  const { tasks } = useTodoContext();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <ToDoHeader />
        <TodoList />

        {tasks.length > 0 && <Footer />}
      </div>

      <Errors />
    </div>
  );
};
