/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';

import { TodoList } from './TodoList';
import { DispatchContext, StateContext } from './TodosProvider';
import { Footer } from './Footer';
import { ErrorMessage } from '../types/ErrorMessage';
import { USER_ID } from '../constants/userId';
import { createTodo, updateTodo } from '../api/todos';
import { TodoItem } from './TodoItem';
import { LoadingStatus } from '../types/LoadingStatus';
import { TEMP_TODO_ID } from '../constants/tempTodoId';

export const TodoApp = () => {
  const {
    todos,
    errorMessage,
    tempTodo,
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const completedTodosCount = todos.filter(
    todo => todo.completed,
  ).length;

  const [title, setTitle] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  let isCompletedAll = completedTodosCount === todos.length;

  const toggleAll = () => {
    isCompletedAll = !isCompletedAll;

    dispatch({
      type: 'shouldLoading',
      payload: LoadingStatus.All,
    });

    const todosForToggle = isCompletedAll
      ? todos.filter(t => !t.completed)
      : todos.filter(t => t.completed);

    todosForToggle.forEach(async todo => {
      try {
        let updatedTodo = todo;

        updatedTodo = {
          ...todo,
          completed: isCompletedAll,
        };
        await updateTodo(updatedTodo);

        dispatch({
          type: 'updateTodo',
          payload: {
            todo: updatedTodo,
            loadingType: LoadingStatus.None,
          },
        });
      } catch (error) {
        isCompletedAll = !isCompletedAll;

        dispatch({
          type: 'error',
          payload: {
            error: ErrorMessage.Updating,
            loadingType: LoadingStatus.None,
          },
        });
      }
    });
  };

  const createNewTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      dispatch({
        type: 'error',
        payload: { error: ErrorMessage.EmptyTitle },
      });
      setIsFocus(true);

      return;
    }

    try {
      const newTodo = {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      };

      dispatch({
        type: 'createTempTodo',
        payload: {
          todo: { ...newTodo, id: TEMP_TODO_ID },
          loadingType: LoadingStatus.Current,
        },
      });

      const responseNewTodo = await createTodo(newTodo);

      dispatch({
        type: 'createTodo',
        payload: {
          todo: responseNewTodo,
          loadingType: LoadingStatus.None,
        },
      });

      setTitle('');
    } catch (error) {
      dispatch({
        type: 'error',
        payload: {
          error: ErrorMessage.Creating,
          loadingType: LoadingStatus.None,
        },
      });
    } finally {
      dispatch({
        type: 'createTempTodo',
        payload: {
          todo: null,
          loadingType: LoadingStatus.None,
        },
      });
      setIsFocus(true);
    }
  };

  const closeErrorMessage = () => {
    dispatch({ type: 'error', payload: { error: ErrorMessage.None } });
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => dispatch(
        { type: 'error', payload: { error: ErrorMessage.None } },
      ), 3000);
    }
  }, [errorMessage, dispatch]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isFocus]);

  useEffect(() => {
    if (inputRef.current) {
      dispatch({
        type: 'setRef',
        payload: inputRef.current,
      });
    }
  }, [dispatch]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={cn(
                'todoapp__toggle-all',
                { active: isCompletedAll },
              )}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form
            onSubmit={createNewTodo}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              ref={inputRef}
              disabled={!!tempTodo}
            />
          </form>

        </header>

        {!!todos.length && (
          <>
            <TodoList />
            {tempTodo && <TodoItem todo={tempTodo} />}
            <Footer />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeErrorMessage}
        />
        {errorMessage}
      </div>
    </div>
  );
};
