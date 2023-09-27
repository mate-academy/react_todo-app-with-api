import React, {
  useEffect,
  useState,
  useMemo,
  useContext,
} from 'react';
import { TodoList } from './components/TodoList/TodoList';
import { getTodos } from './api/todos';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { getFilteredTodos } from './utils/getTodos';
import { TodoContext } from './context/TodoContext';
import { USER_ID } from './utils/constants';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
  } = useContext(TodoContext);

  const [filter, setFilter] = useState(Filter.All);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadingError);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(ErrorMessage.Default);
      }, 3000);
    }
  }, [errorMessage]);

  const renderedTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        <TodoList todos={renderedTodos} />

        {!!todos.length && (
          <TodoFooter
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
