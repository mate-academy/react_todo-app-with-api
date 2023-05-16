/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, useContext, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Error';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/FilterConditions';
import { USER_ID } from './constants';
import { TodoContext } from './components/TodoProvider';

export const App: FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const {
    todos,
    error,
    setError,
  } = useContext(TodoContext);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      case Filter.All:
      default:
        return [...todos];
    }
  }, [todos, filter]);

  useEffect(() => {
    const timerId = setTimeout(() => setError(ErrorType.None), 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  const handleErrorNotification = () => {
    setError(ErrorType.None);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          preparedTodos={filteredTodos}
          onChangeTempTodo={setTempTodo}
        />

        <TodoList
          preparedTodos={filteredTodos}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            filter={filter}
            onChangeFilter={setFilter}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: error === ErrorType.None,
        },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={handleErrorNotification}
        />
        {error}
      </div>
    </div>
  );
};
