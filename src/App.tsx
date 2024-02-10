/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import classNames from 'classnames';

import { UserWarning } from './components/UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';

import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { PageContext } from './utils/GlobalContext';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const {
    error,
    setError,
    todoList,
    setTodoList,
    USER_ID,
    filterStatus,
  } = useContext(PageContext);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case Status.active:
        return todoList.filter(todo => !todo.completed);

      case Status.completed:
        return todoList.filter(todo => todo.completed);

      default:
        return todoList;
    }
  }, [filterStatus, todoList]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodoList)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, [setError, setTodoList, USER_ID]);

  const hideError = () => {
    setError('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          todos={todoList}
          setTempTodo={setTempTodo}
        />

        {todoList.length > 0
          && (
            <>
              <Main
                todos={filteredTodos}
                tempTodo={tempTodo}
              />

              <Footer />
            </>
          )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {error}
      </div>
    </div>
  );
};
