import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getTodos } from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { Loader } from './components/Loader';
import { AppContext } from './components/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const {
    userId,
    todos,
    setTodos,
    setErrorMessage,
    showError,
  } = useContext(AppContext);

  const loadTodosFromServer = useCallback(async () => {
    setIsLoadingTodos(true);
    setErrorMessage('');

    try {
      const todosFromServer = await getTodos(userId);

      setTodos(todosFromServer);
    } catch {
      showError('Unable to load todos');
    } finally {
      setIsLoadingTodos(false);
    }
  }, []);

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        todos
      </h1>

      <div className="todoapp__content">
        <Header />

        {isLoadingTodos && (
          <Loader />
        )}

        <TodoList />

        {todos.length > 0 && (
          <Footer />
        )}
      </div>

      <ErrorMessage />
    </div>
  );
};
