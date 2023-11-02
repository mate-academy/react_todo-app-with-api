/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';

import { ActionType } from '../states/Reducer';
import { DispatchContext, StateContext } from '../states/Global';
import { postTodo, updateTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { Todo } from '../types/Todo';

export const TodoHeader: React.FC = React.memo(() => {
  const { userId, todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isAllCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const createTodo = useCallback((preparedTitle: string) => {
    postTodo({
      userId,
      title: preparedTitle,
      completed: false,
    })
      .then(response => {
        setTitle('');

        dispatch({
          type: ActionType.CreateTodo,
          payload: {
            todo: response,
          },
        });
      })
      .catch(() => {
        dispatch({
          type: ActionType.ToggleError,
          payload: { errorType: ErrorType.CreateError },
        });
      })
      .finally(() => {
        setIsLoading(false);

        dispatch({
          type: ActionType.SetTempTodo,
          payload: { tempTodo: null },
        });
      });
  }, [dispatch, userId]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const tempTodo: Todo = {
      id: 0,
      userId,
      title,
      completed: false,
    };

    dispatch({
      type: ActionType.SetTempTodo,
      payload: { tempTodo },
    });

    if (title.trim()) {
      createTodo(title.trim());
    } else {
      setIsLoading(false);
      dispatch({
        type: ActionType.ToggleError,
        payload: { errorType: ErrorType.TitleError },
      });
      dispatch({
        type: ActionType.SetTempTodo,
        payload: { tempTodo: null },
      });
    }
  }, [createTodo, dispatch, title, userId]);

  const toggleAll = useCallback(() => {
    const requestsArr = todos
      .filter(todo => {
        return isAllCompleted
          ? true
          : !todo.completed;
      })
      .map(todo => {
        dispatch({
          type: ActionType.SetTodoToProcess,
          payload: { todo },
        });

        return updateTodo(
          { ...todo, completed: !isAllCompleted },
          dispatch,
        );
      });

    Promise.allSettled(requestsArr)
      .finally(() => {
        dispatch({
          type: ActionType.SetTodoToProcess,
          payload: { todo: null },
        });
      });
  }, [dispatch, isAllCompleted, todos]);

  useEffect(() => {
    if (!isLoading || todos.length === 0) {
      inputRef.current?.focus();
    }
  }, [isLoading, todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
