/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { todosContext } from './Store';
import { Footer } from './components/Footer/Footer';
import { items } from './utils/utils';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const { state } = useContext(todosContext);
  const { todos, filter, tempTodo, updatedAt, errorMessage } = state;

  const displayedTodos = useMemo(() => {
    return items.filter(todos, filter);
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={displayedTodos}
              updatedAt={updatedAt}
              tempTodo={tempTodo}
            />

            <Footer />
          </>
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
