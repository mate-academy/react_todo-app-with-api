import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getTodos } from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Loader } from './components/Loader/Loader';
import { AppContext } from './components/AppContext/AppContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [isLoadingallTodos, setIsLoadingallTodos] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const {
    userId,
    allTodos,
    setAllTodos,
    setShouldShowError,
    showError,
  } = useContext(AppContext);

  const loadallTodosFromServer = useCallback(async () => {
    setIsLoadingallTodos(true);
    setShouldShowError(false);

    try {
      const allTodosFromServer = await getTodos(userId);

      setAllTodos(allTodosFromServer);
    } catch {
      showError('Unable to load allTodos');
    } finally {
      setIsLoadingallTodos(false);
    }
  }, []);

  useEffect(() => {
    loadallTodosFromServer();
  }, []);

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        allTodos
      </h1>

      <div className="todoapp__content">
        <Header />

        {isLoadingallTodos && (
          <Loader />
        )}

        <TodoList />

        {allTodos.length > 0 && (
          <Footer />
        )}
      </div>

      <ErrorMessage />
    </div>
  );
};
