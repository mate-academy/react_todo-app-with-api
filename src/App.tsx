import React, { useEffect } from 'react';
import { getTodos } from './api/todos';
import { useTodosContext } from './context/useTodosContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Error } from './types/Error';

export const App: React.FC = () => {
  const { todos, setTodos, handleError, setIsInputFocused } = useTodosContext();

  useEffect(() => {
    setIsInputFocused(true);

    getTodos()
      .then(setTodos)
      .catch(() => handleError(Error.loadTodos));
  }, [setTodos, handleError, setIsInputFocused]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!todos.length && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
