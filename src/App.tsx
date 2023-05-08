/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  getActiveTodos,
  getCompletedTodos,
  postTodos,
  deleteTodos,
  patchTodos,
} from './api/todos';

import { Todo as TodoType } from './types/Todo';
import { Todo } from './components/Todo';
import { Filter } from './components/Filter';
import { TempTodo } from './components/TempTodo';
import { Error } from './components/Error/Error';
import { FilterParams } from './components/Filter/FilterParams';

const USER_ID = 9925;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [filterParam, setFilterParam] = useState(FilterParams.All);
  const [activeTodos, setActiveTodos] = useState<null | TodoType[]>(null);
  const [completedTodos, setCompletedTodos] = useState<null | TodoType[]>(null);

  const [inputValue, setInputValue] = useState('');
  const [isGetError, setIsGetError] = useState(false);
  const [isPostError, setIsPostError] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(false);
  const [isInputEmpty, setIsEmptyInputState] = useState(false);
  const [isInputLocked, setIsLockInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<string | null>(null);
  const [isClearAllCompleted, setIsClearAllCompleted] = useState(false);
  const [isToggleAllCompleted, setIsToggleAllCompleted] = useState(false);
  const [isToggleAllActive, setIsToggleAllActive] = useState(false);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      const { completed } = todo;

      switch (filterParam) {
        case FilterParams.Active:
          return !completed;
        case FilterParams.Completed:
          return completed;
        default:
          return true;
      }
    });
  }, [todos, filterParam]);

  const todosGetter = useCallback(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(setIsGetError);
  }, []);

  const formInputHandler
  = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    setInputValue(value);
  }, []);

  const postTodoToServer
  = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event.nativeEvent;

    if (key === 'Enter') {
      if (!inputValue.trim()) {
        setIsEmptyInputState(true);
      } else {
        setIsLockInput(true);
        setTempTodo(inputValue);

        postTodos(USER_ID, inputValue)
          .catch(setIsPostError)
          .finally(() => {
            setIsLockInput(false);
            setTempTodo(null);
            setInputValue('');
            todosGetter();
          });
      }
    }
  }, [inputValue]);

  const disableErrorHandling = useCallback(() => {
    setIsGetError(false);
    setIsPostError(false);
    setIsDeleteError(false);
    setIsEmptyInputState(false);
  }, []);

  useEffect(() => {
    todosGetter();
  }, []);

  useMemo(() => {
    getActiveTodos(USER_ID)
      .then(setActiveTodos)
      .catch(setIsGetError);

    getCompletedTodos(USER_ID)
      .then(setCompletedTodos)
      .catch(setIsGetError);
  }, [todos, filterParam]);

  const deleteAllCompleted = useCallback(async () => {
    try {
      setIsClearAllCompleted(true);

      const arrayOfCompletedTodos
      = await getCompletedTodos(USER_ID);

      const deletePromises
      = arrayOfCompletedTodos.map(todo => deleteTodos(todo.id));

      await Promise.all(deletePromises);
    } finally {
      setIsClearAllCompleted(false);
      todosGetter();
    }
  }, []);

  const toggleAll = async () => {
    try {
      if (completedTodos !== null
        && completedTodos.length === todos.length) {
        setIsToggleAllCompleted(true);

        await Promise.all(completedTodos.map(
          todo => patchTodos(todo.id, { completed: false }),
        ));
      }
    } finally {
      setIsToggleAllCompleted(false);
      todosGetter();
    }

    try {
      if (activeTodos !== null) {
        setIsToggleAllActive(true);

        await Promise.all(activeTodos.map(
          todo => patchTodos(todo.id, { completed: true }),
        ));
      }
    } finally {
      setIsToggleAllActive(false);
      todosGetter();
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: completedTodos?.length === todos.length },
            )}
            onClick={toggleAll}
          />

          <form onSubmit={(event) => event.preventDefault()}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isInputLocked}
              value={inputValue}
              onChange={formInputHandler}
              onKeyDown={postTodoToServer}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {visibleTodos.map(todo => (
            <Todo
              key={todo.id}
              todoItem={todo}
              todosUpdate={todosGetter}
              setDeleteError={setIsDeleteError}
              setPostError={setIsPostError}
              isClearAllCompleted={isClearAllCompleted}
              toggleActive={isToggleAllActive}
              toggleCompleted={isToggleAllCompleted}
            />
          ))}
          {tempTodo && (
            <TempTodo title={inputValue} />
          )}
        </section>

        {(!!todos.length || tempTodo) && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos?.length} items left`}
            </span>

            <Filter
              setFilterParam={setFilterParam}
              filterParam={filterParam}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!completedTodos?.length}
              onClick={deleteAllCompleted}
            >
              {!!completedTodos?.length && 'Clear completed'}
            </button>
          </footer>
        )}
      </div>

      {(isGetError || isPostError || isDeleteError || isInputEmpty) && (
        <Error
          getDataError={isGetError}
          postDataError={isPostError}
          deleteDataError={isDeleteError}
          inputState={isInputEmpty}
          disableErrorHandling={disableErrorHandling}
        />
      )}
    </div>
  );
};
