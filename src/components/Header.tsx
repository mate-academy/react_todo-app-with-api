/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DispatchContext, StateContext } from './MainContext';
import { ActionTypes } from '../types/ActionTypes';
import { USER_ID, addTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  query: string;
  setQuery: (query: string) => void;
  setTempTodo: (todo: Todo | null) => void;
}

export const Header: React.FC<Props> = ({ query, setQuery, setTempTodo }) => {
  const [disableInput, setDisableInput] = useState(false);
  const dispatch = useContext(DispatchContext);
  const { todos, errorMessage, selectPage } = useContext(StateContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage, selectPage]);

  const isActiveButton = todos.every(todo => todo.completed);

  const clearQueryAndEnableInput = () => {
    setQuery('');
    setDisableInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisableInput(true);

    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedQuery,
        completed: false,
      });

      addTodo({
        userId: USER_ID,
        title: trimmedQuery,
        completed: false,
      })
        .then(newTodo => {
          dispatch({
            type: ActionTypes.AddTodo,
            payload: newTodo,
          });

          clearQueryAndEnableInput();
          setTempTodo(null);
        })
        .catch(() => {
          dispatch({
            type: ActionTypes.SetValuesByKeys,
            payload: {
              errorMessage: 'Unable to add a todo',
            },
          });

          setTempTodo(null);
          setDisableInput(false);
        });
    } else {
      dispatch({
        type: ActionTypes.SetValuesByKeys,
        payload: {
          errorMessage: 'Title should not be empty',
        },
      });

      clearQueryAndEnableInput();
    }
  };

  const handleToggleAll = () => {
    dispatch({
      type: ActionTypes.LoadingIdTodos,
      payload: todos.filter(todo => !todo.completed).map(todo => todo.id),
    });

    todos.forEach(todo => {
      if (todo.completed === isActiveButton) {
        updateTodo(todo.id, { ...todo, completed: !isActiveButton })
          .then(() => {
            dispatch({
              type: ActionTypes.ToggleTodo,
              payload: { ...todo, completed: !isActiveButton },
            });

            dispatch({
              type: ActionTypes.LoadingIdTodos,
              payload: [],
            });
          })
          .catch(() => {
            dispatch({
              type: ActionTypes.SetValuesByKeys,
              payload: {
                errorMessage: 'Unable to update a todo',
              },
            });

            dispatch({
              type: ActionTypes.LoadingIdTodos,
              payload: [],
            });
          });
      }
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isActiveButton,
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle all todos"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="newTodo">
          <input
            id="newTodo"
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            disabled={disableInput}
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </label>
      </form>
    </header>
  );
};
