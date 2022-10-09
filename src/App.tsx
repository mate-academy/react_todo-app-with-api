/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/Todos/ErrorNotification';
import { Filter } from './components/Todos/Filter';
import { NewTodo } from './components/Todos/NewTodo';
import { TodoList } from './components/Todos/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';
import { Error } from './types/Errors';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState<Error | null>(null);
  const [loader, setLoader] = useState(true);
  const [title, setTitle] = useState('');
  const [toggleAll, setToggleAll] = useState(false);

  const filterTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => setError(Error.Connect));
  }, []);

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          userId={userId}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
          setLoader={setLoader}
          title={title}
          setTitle={setTitle}
          setToggleAll={setToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos}
              setTodos={setTodos}
              setError={setError}
              loader={loader}
              title={title}
              toggleAll={toggleAll}
              setToggleAll={setToggleAll}
            />

            <Filter
              todos={filterTodos}
              setTodos={setTodos}
              filterType={filterType}
              setFilterType={setFilterType}
              setError={setError}
            />
          </>
        )}
      </div>
      <ErrorNotification
        error={error}
        setError={setError}
      />
    </div>
  );
};
