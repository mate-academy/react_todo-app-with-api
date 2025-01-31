import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotifications } from './components/ErrorNotifications';
import { AppProvider, useAppContext } from './HooksContext';

const AppContent: React.FC = () => {
  const { setLoading, setAllTodos, setErrorMessage, allTodos } =
    useAppContext();

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(todosFromServer => {
        setAllTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <TodoList />

        {allTodos.length > 0 && <Footer />}
      </div>

      <ErrorNotifications />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};
