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
  const [isGetError, setGetError] = useState(false);
  const [isPostError, setPostError] = useState(false);
  const [isDeleteError, setDeleteError] = useState(false);
  const [isInputEmpty, setEmptyInputState] = useState(false);
  const [isInputLocked, setLockInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<string | null>(null);
  const [isClearAllCompleted, setClearAllCompleted] = useState(false);
  const [isToggleAllCompleted, setToggleAllCompleted] = useState(false);
  const [isToggleAllActive, setToggleAllActive] = useState(false);

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
      .then(result => {
        setTodos(result);
      })
      .catch(() => {
        setGetError(true);
      });
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
        setEmptyInputState(true);
      } else {
        setLockInput(true);
        setTempTodo(inputValue);

        postTodos(USER_ID, inputValue)
          .catch(() => {
            setPostError(true);
          })
          .finally(() => {
            setLockInput(false);
            setTempTodo(null);
            setInputValue('');
            todosGetter();
          });
      }
    }
  }, [inputValue]);

  const disableErrorHandling = useCallback(() => {
    setGetError(false);
    setPostError(false);
    setDeleteError(false);
    setEmptyInputState(false);
  }, []);

  useEffect(() => {
    todosGetter();
  }, []);

  useMemo(() => {
    getActiveTodos(USER_ID)
      .then(result => setActiveTodos(result))
      .catch(() => setGetError(true));

    getCompletedTodos(USER_ID)
      .then(result => setCompletedTodos(result))
      .catch(() => setGetError(true));
  }, [todos, filterParam]);

  const deleteAllCompleted = useCallback(async () => {
    try {
      setClearAllCompleted(true);

      const arrayOfCompletedTodos
      = await getCompletedTodos(USER_ID);

      const deletePromises
      = arrayOfCompletedTodos.map(todo => deleteTodos(todo.id));

      await Promise.all(deletePromises);
    } finally {
      setClearAllCompleted(false);
      todosGetter();
    }
  }, []);

  const toggleAll = async () => {
    try {
      if (completedTodos !== null
        && completedTodos.length === todos.length) {
        setToggleAllCompleted(true);

        await Promise.all(completedTodos.map(
          todo => patchTodos(todo.id, { completed: false }),
        ));
      }
    } finally {
      setToggleAllCompleted(false);
      todosGetter();
    }

    try {
      if (activeTodos !== null) {
        setToggleAllActive(true);

        await Promise.all(activeTodos.map(
          todo => patchTodos(todo.id, { completed: true }),
        ));
      }
    } finally {
      setToggleAllActive(false);
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
            onClick={() => toggleAll()}
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

        {(!!visibleTodos.length || tempTodo) && (
          <>
            <section className="todoapp__main">
              {visibleTodos.map(todo => (
                <Todo
                  key={todo.id}
                  todoItem={todo}
                  todosUpdate={todosGetter}
                  setDeleteError={setDeleteError}
                  setPostError={setPostError}
                  isClearAllCompleted={isClearAllCompleted}
                  toggleActive={isToggleAllActive}
                  toggleCompleted={isToggleAllCompleted}
                />
              ))}
              {tempTodo && (
                <TempTodo title={inputValue} />
              )}
            </section>
          </>
        )}

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
