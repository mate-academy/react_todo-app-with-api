/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { todosContext } from './Store';
import { Footer } from './components/Footer/Footer';

import { items } from './utils/utils';
import { ErrorNotification } from './components/ErrorNotification';

import { handleGettingTodos } from './utils/handleGettingTodos';

export const App: React.FC = () => {
  const [state, setters] = useContext(todosContext);
  const { todos, filter, tempTodo, loading, updatedAt, errorMessage } = state;
  const timerId = useRef(0);

  useEffect(() => {
    handleGettingTodos(setters);
  }, []);

  useEffect(() => {
    if (errorMessage) {
      clearTimeout(timerId.current);
      timerId.current = window.setTimeout(() => {
        setters.setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage, loading, setters]);

  const displayedTodos = useMemo(() => {
    return items.filter(todos, filter);
  }, [todos, filter, updatedAt]);

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
