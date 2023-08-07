/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from './types/Todo';
import { changeTodo, getTodos } from './api/todos';
import { FilterType } from './types/filter';

import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';

import {
  USER_ID,
  ERROR_TIMEOUT,
  FETCH_ERROR,
  UPDATING_ERROR,
} from './utils/constants';

const filterActive = (
  data: Todo[],
) => data.filter((todo) => todo.completed === false);

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [loadingTodos, setLoadingTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Active:
        return filterActive(todos);
      case FilterType.Completed:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterType]);

  const activeLength = useMemo(
    () => filterActive(todos).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed === true),
    [todos],
  );

  const errorHandler = useCallback((errorText: string) => {
    setErrorMessage(errorText);
    setTimeout(() => setErrorMessage(''), ERROR_TIMEOUT);
  }, [errorMessage]);

  const updateTodos = useCallback((updatedTodo: Todo) => {
    setTodos((prevTodos: Todo[]) => {
      return prevTodos.map((todo) => (
        todo.id === updatedTodo.id
          ? updatedTodo
          : todo));
    });
  }, []);

  const updateTodoStatus = useCallback((id: number, completed = false) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    setLoadingTodos((prevTodos: Todo[]) => [...prevTodos, todoToUpdate]);

    changeTodo(id, { ...todoToUpdate, completed })
      .then((updatedTodo) => {
        const typedUpdatedTodo = updatedTodo as Todo;

        updateTodos(typedUpdatedTodo);
      })
      .catch(() => errorHandler(UPDATING_ERROR));
  }, [todos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromApi) => {
        setTodos(todosFromApi);
        setErrorMessage('');
      })
      .catch(() => {
        errorHandler(FETCH_ERROR);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          activeLength={activeLength}
          todosLength={todos.length}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          errorHandler={errorHandler}
          tempTodo={tempTodo}
          updateTodoStatus={updateTodoStatus}
          title={todoTitle}
          setTitle={setTodoTitle}
        />

        <Main
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          setTodos={setTodos}
          errorHandler={errorHandler}
          loadingTodos={loadingTodos}
          setLoadingTodos={setLoadingTodos}
          updateTodoStatus={updateTodoStatus}
          prevTitle={todoTitle}
          setTitle={setTodoTitle}
          updateTodos={updateTodos}
        />

        {(todos.length > 0 || tempTodo)
        && (
          <>
            <Footer
              filterType={filterType}
              setFilterType={setFilterType}
              itemsAmount={activeLength}
              completedTodos={completedTodos}
              setTodos={setTodos}
              setLoadingTodos={setLoadingTodos}
              errorHandler={errorHandler}
            />
          </>
        )}
      </div>

      <div
        className={`notification is-danger is-light has-text-weight-normal ${cn({ hidden: !errorMessage })}`}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
