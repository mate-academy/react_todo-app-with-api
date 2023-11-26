import { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodoContext } from '../TodoContext';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { TodosFilter } from './TodoFilter';
import { Error } from '../types/Error';

export const TodoApp: React.FC = () => {
  const {
    todos,
    error,
    setError,
  } = useContext(TodoContext);

  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
        setTimeout(() => setError(Error.Empty), 800);
      }, 3000);
    }
  }, [error, setError]);

  const closeNotification = () => {
    setErrorVisible(false);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {!!todos.length && (
          <>
            <TodoList />
            <TodosFilter />
          </>
        )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorVisible },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="hide error"
          onClick={closeNotification}
        />
        {error || ''}
      </div>
    </div>
  );
};
