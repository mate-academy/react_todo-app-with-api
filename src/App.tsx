/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { UserWarning } from './components/UserWarning';
import { TodoList } from './components/TodoList';
import { Status } from './types/FilterStatus';
import { ErrorNotification } from './components/ErrorNotification';
import { TodosContext } from './TodosContext';
import { ErrorContext } from './ErrorContext';
import { filterTodos } from './utils/filterTodos';
import { Header } from './components/Header';
import { USER_ID } from './utils/constants';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [filterParam, setFilterParam] = useState(Status.All);
  const { error, setError } = useContext(ErrorContext);

  const {
    todos,
  } = useContext(TodosContext);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (error) {
      timer = setTimeout(() => {
        setError('');
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [error]);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, filterParam);
  }, [todos, filterParam]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!todos.length && (
          <TodoList
            todos={visibleTodos}
          />
        )}

        {!!todos.length && (
          <Footer
            filterParam={filterParam}
            onFilterChange={setFilterParam}
          />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
