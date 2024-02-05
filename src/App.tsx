/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { USER_ID } from './utils/constants';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoContext } from './contexts/TodoContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const {
    setErrorMessage,
    todos,
    setTodos,
  } = useContext(TodoContext);

  const handleOverLoad = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => setTodos(response))
      .catch(() => setErrorMessage(ErrorMessage.FailedLoad))
      .finally(() => handleOverLoad());
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header />

      <div className="todoapp__content">

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList />
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (<Footer />)}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Error />
    </div>
  );
};
