/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import { TodosFilter } from './components/TodosFiltered/TodosFiltered';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { URL, USER_ID } from './utils/Url';
import { TodoApp } from './components/TodoApp/TodoApp';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);

  const [errorMessage, setErrorMessage] = useState<string>('');

  const getData = () => {
    client.get(URL).then(data => {
      const todosData = data as Todo[];

      setTodos(todosData);
      setAllTodos(todosData);
    })
      .catch(error => {
        setErrorMessage('Unable to load todos');
        // eslint-disable-next-line no-console
        console.error('An error occurred:', error);
      });
  };

  useEffect(() => {
    getData();
  }, [setTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoApp
          setTodos={setTodos}
          todos={todos}
          allTodos={allTodos}
          setErrorMessage={setErrorMessage}
          setAllTodos={setAllTodos}
        />

        {allTodos.length > 0 && (
          <footer className="todoapp__footer">
            <TodosFilter
              setErrorMessage={setErrorMessage}
              todos={todos}
              setTodos={setTodos}
              allTodos={allTodos}
            />
          </footer>
        )}
      </div>

      {errorMessage
        && (
          <div
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              type="button"
              className="delete"
              onClick={() => setErrorMessage('')}
            />

            {errorMessage}
          </div>
        )}
    </div>
  );
};
