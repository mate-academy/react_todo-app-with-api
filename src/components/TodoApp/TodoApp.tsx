import React, { useContext, useRef } from 'react';
import { GlobalContext } from '../GlobalContextProvider';
import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { ErrorNotification } from '../ErrorNotification';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(GlobalContext);
  const textField = useRef<HTMLInputElement>(null);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header titleField={textField} />

        <TodoList textField={textField} />

        {!!todos.length && (
          <Footer inputField={textField} />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
