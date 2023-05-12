/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import { USER_ID } from './utils/constants';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

import { Todo } from './types/Todo';
import { TodoError } from './types/TodoError';
import { getTodos } from './api/todos';
import { Loader } from './components/Loader';
import { formatTodos } from './utils/formatResponse';
import { TodoResponse } from './types/TodoResponse';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState<TodoError[]>([]);
  const [todosToRender, setTodosToRender] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTempLoading, setIsTempLoading] = useState(false);
  const [toBeCleared, setToBeCleared] = useState<Todo[]>([]);
  const [isToggleAll, setIsToggleAll] = useState(false);
  const [isSameStatus, setIsSameStatus] = useState(false);

  const showError = useCallback((title = 'Unable to load') => {
    setErrors(prev => {
      const newError = {
        title,
        isImportant: true,
      };

      return prev ? [...prev, newError] : [newError];
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getTodos().then(res => {
      setTodos(formatTodos(res as TodoResponse[]));
    })
      .catch(() => showError())
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setTodosToRender(todos);
    setIsSameStatus(todos
      .every(a => todos.every(b => b.completed === a.completed)));
  }, [todos]);

  const toggleAll = () => {
    if (!isSameStatus) {
      setTodos([...todos].map(item => ({ ...item, completed: true })));

      return;
    }

    setTodos([...todos]
      .map(item => ({ ...item, completed: !item.completed })));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          showError={showError}
          setTempTodo={setTempTodo}
          setIsTempLoading={setIsTempLoading}
          setTodos={setTodos}
          setIsToggleAll={setIsToggleAll}
        />
        {todos && !isLoading
          ? (
            <>
              <Main
                todos={todos}
                todosToRender={todosToRender}
                tempTodo={tempTodo}
                isTempLoading={isTempLoading}
                setTodos={setTodos}
                showError={showError}
                toBeCleared={toBeCleared}
                isToggleAll={isToggleAll}
                setIsToggleAll={setIsToggleAll}
                isSameStatus={isSameStatus}
                toggleAll={toggleAll}
              />
              <Footer
                todos={todos}
                todosToRender={todosToRender}
                setTodosToRender={setTodosToRender}
                setToBeCleared={setToBeCleared}
              />
            </>
          )
          : !errors && <Loader />}
      </div>
      {!!errors.length
      && (
        <Notification
          errors={errors}
          setErrors={setErrors}
        />
      )}
    </div>
  );
};
