import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './utils/ErrorMessage';
import { SetErrorContext } from './utils/setErrorContext';
import { TodoList, TodoFooter, TodoError } from './components';
import { FilteringMode } from './utils/FilteringMode';

const USER_ID = 10624;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteringMode, setFilteringMode]
    = useState<FilteringMode>(FilteringMode.all);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.NoError);
  const [todosToBeEdited, setTodosToBeEdited]
  = useState<Todo['id'][] | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => setTodos(response))
      .catch(() => setError(ErrorMessage.CantFetch));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <SetErrorContext.Provider value={setError}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoList
            todos={todos}
            filteringMode={filteringMode}
            userId={USER_ID}
            setTodos={setTodos}
            todosToBeEdited={todosToBeEdited}
            setTodosToBeEdited={setTodosToBeEdited}
          />

          {todos.length && (
            <TodoFooter
              setFilteringMode={setFilteringMode}
              filteringMode={filteringMode}
              todos={todos}
              setTodos={setTodos}
              setTodosToBeEdited={setTodosToBeEdited}
            />
          )}
        </div>

        {error && <TodoError error={error} />}
      </div>
    </SetErrorContext.Provider>
  );
};

export { ErrorMessage };
