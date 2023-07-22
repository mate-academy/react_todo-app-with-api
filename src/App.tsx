import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { FilterStatus, Todo } from './types/Types';
import { showError, getFilteredTodos } from './helpers/helpers';
import { Error } from './components/Error';
import { Footer } from './components/Footer';
import { Todos } from './components/Todos';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterStatus.ALL);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);

  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError('Failed to get list of todos', setError));
  }, []);

  const visibleTodos = getFilteredTodos(todos, filter);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          setError={setError}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          setLoader={setLoadingTodos}
        />

        <Todos
          todos={visibleTodos}
          tempTodo={tempTodo}
          setError={setError}
          setTodos={setTodos}
          loader={loadingTodos}
          setLoader={setLoadingTodos}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            setTodos={setTodos}
            setError={setError}
            setLoader={setLoadingTodos}
          />
        )}

      </div>
      <Error error={error} setError={setError} />
    </div>
  );
};
