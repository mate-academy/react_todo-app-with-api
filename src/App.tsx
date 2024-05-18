import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getData } from './api/todos';
import { TypeTodo } from './types/Todo';
import classNames from 'classnames';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [todos, setTodos] = useState<TypeTodo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<TypeTodo | null>(null);

  const [inputFocus, setInputFocus] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const allTodosCompleted = todos.every(todo => todo.completed);
  const hasTodos = todos.length !== 0;

  const filteredTodo = todos.filter(todo => {
    if (filterType === FilterType.Active) {
      return !todo.completed;
    }

    if (filterType === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    setIsLoading(true);
    getData()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setIsLoading(false));

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (inputFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, inputFocus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          inputRef={inputRef}
          isLoading={isLoading}
          inputFocus={inputFocus}
          setTempTodo={setTempTodo}
          setIsLoading={setIsLoading}
          setInputFocus={setInputFocus}
          setErrorMessage={setErrorMessage}
          setLoadingTodos={setLoadingTodos}
          allTodosCompleted={allTodosCompleted}
        />

        <TodoList
          todos={todos}
          setTodos={setTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          loadingTodos={loadingTodos}
          filteredTodo={filteredTodo}
          setIsLoading={setIsLoading}
          setInputFocus={setInputFocus}
          setErrorMessage={setErrorMessage}
        />

        {hasTodos && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            filterType={filterType}
            setLoadingTodos={setLoadingTodos}
            setIsLoading={setIsLoading}
            setFilterType={setFilterType}
            setInputFocus={setInputFocus}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={
          classNames(
            "notification is-danger is-light has-text-weight-normal",
            {"hidden": !errorMessage }
          )
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
