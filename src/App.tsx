import React, {
  useEffect,
  useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Footer } from './components/Footer';
import { prepareTodos } from './helpers';
import { Header } from './components/Header';
import { ErrorType } from './types/ErrorType';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { useAppContext } from './AppContext';
import { USER_ID } from './userId/userId';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    status,
    setStatus,
    error,
    handleError,
  } = useAppContext();

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => handleError(ErrorType.cantLoadTodos));
  }, [setTodos, handleError]);

  const todosOnPage = useMemo(() => prepareTodos({
    todos,
    status,
  }), [status, todos]);

  const uncompletedTodosCount = todos.filter(todo => (
    !todo.completed
  )).length;

  const isSomeTodosCompleted = todos.some(
    todo => todo.completed,
  );

  const isEveryTodosCompleted = todosOnPage.every(
    todo => todo.completed,
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isEveryTodosCompleted={isEveryTodosCompleted}
        />

        <TodoList
          todos={todosOnPage}
        />

        {todos.length > 0 && (
          <Footer
            uncompletedTodosCount={uncompletedTodosCount}
            status={status}
            setStatus={setStatus}
            isSomeTodosCompleted={isSomeTodosCompleted}
          />
        )}

        {error && (
          <ErrorNotification />
        )}
      </div>
    </div>
  );
};
