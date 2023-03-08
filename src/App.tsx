/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';

import { ErrorNotification } from './components/ErrorNotification';
import { FooterMenu } from './components/FooterMenu';
import { ListOfTodos } from './components/ListOfTodos';
import { Header } from './components/Header';
import { UserWarning } from './UserWarning';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { CustomError } from './types/CustomError';

import { getTodos } from './api/todos';
import { USER_ID } from './utils/fetchClient';
import { useError } from './utils/useError';
import { LoadStatusContext } from './utils/LoadStatusContext';

import { initData } from './constants/initData';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(initData.todos);
  const [loadingStatus, setLoadingStatus]
    = useState<number[]>(initData.loadingState);
  const [filter, setFilter] = useState<Filter>(initData.filter);
  const [customError, setError]
    = useError(initData.customError);
  const [activeLeft, setActiveLeft]
    = useState<number>(initData.activeLeft);
  const [tempTodo, setTempTodo] = useState<Todo | null>(initData.tempTodo);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setActiveLeft(todosFromServer.filter(todo => !todo.completed).length);
      })
      .catch(() => {
        setError(CustomError.Update, 3000);
      });
  }, []);

  useEffect(() => {
    setActiveLeft(todos.filter(todo => !todo.completed).length);
    setError(CustomError.NoError);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.All: {
        return todos;
      }

      case Filter.Active: {
        return todos.filter(todo => !todo.completed);
      }

      case Filter.Completed: {
        return todos.filter(todo => todo.completed);
      }

      default: {
        setError(CustomError.Update);

        return todos;
      }
    }
  },
  [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <LoadStatusContext.Provider value={{ loadingStatus, setLoadingStatus }}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            todos={todos}
            setTodos={setTodos}
            tempTodo={tempTodo}
            setTempTodo={setTempTodo}
            activeLeft={activeLeft}
            setError={setError}
          />

          <ListOfTodos
            todos={filteredTodos}
            setTodos={setTodos}
            tempTodo={tempTodo}
            setError={setError}
          />

          {!!todos.length && (
            <FooterMenu
              todos={filteredTodos}
              setTodos={setTodos}
              filter={filter}
              setFilter={setFilter}
              activeLeft={activeLeft}
              setError={setError}
            />
          )}
        </div>

        {customError && (
          <ErrorNotification
            customError={customError}
            setError={setError}
          />
        )}
      </div>

    </LoadStatusContext.Provider>
  );
};
