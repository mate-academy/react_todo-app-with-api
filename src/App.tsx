import React,
{
  useContext, useEffect, useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorType } from './types/ErrorType';
import { ErrorInfo } from './components/ErrorInfo/ErrorInfo';
import { filterTodos } from './helpers/filterTodos';
import { USER_ID } from './utils/userId';
import { AppContext } from './contexts/appContext';

export const App: React.FC = () => {
  const {
    todosFromServer,
    filterBy,
    setTodosFromServer,
    setErrorMessage,
  } = useContext(AppContext);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => setErrorMessage(ErrorType.UnableToLoad));
  }, [setTodosFromServer, setErrorMessage]);

  const todosToView = useMemo(
    () => filterTodos(todosFromServer, filterBy),
    [todosFromServer, filterBy],
  );

  const isEveryTodosCompleted = todosToView.every(
    todo => todo.completed,
  );

  const uncompletedTodosCount = todosFromServer
    .filter((todo) => !todo.completed).length;

  const isSomeTodosCompleted = todosFromServer.some((todo) => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header isEveryTodosCompleted={isEveryTodosCompleted} />

        <TodoList todosToView={todosToView} />

        {todosFromServer.length > 0 && (
          <Footer
            uncompletedTodosCount={uncompletedTodosCount}
            isSomeTodosCompleted={isSomeTodosCompleted}
          />
        )}
      </div>

      <ErrorInfo />
    </div>
  );
};
