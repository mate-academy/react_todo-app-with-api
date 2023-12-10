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

  const titleRef = useRef<HTMLInputElement | null>(null);
  const completedTodosCount = todos.filter(
    todo => todo.completed,
  ).length;

  const [title, setTitle] = useState('');
  let isCompletedAll = completedTodosCount === todos.length;

  const createTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

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
      let updatedTodo = todo;

      updatedTodo = {
        ...todo,
        completed: isCompletedAll,
      };

      try {
        await updateTodo(updatedTodo);

        dispatch({
          type: 'updateTodo',
          payload: updatedTodo,
        });
        dispatch({
          type: 'shouldLoading',
          payload: LoadingStatus.None,
        });
      } catch (error) {
        isCompletedAll = !isCompletedAll;

        dispatch({
          type: 'error',
          payload: ErrorMessage.Updating,
        });

        dispatch({
          type: 'shouldLoading',
          payload: LoadingStatus.None,
        });
      }
    });
  };

  const createNewTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim()) {
      const newTodo = {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      };

      dispatch({
        type: 'createTempTodo',
        payload: { ...newTodo, id: TEMP_TODO_ID },
      });

      dispatch({
        type: 'shouldLoading',
        payload: LoadingStatus.Current,
      });

      try {
        const responseNewTodo = await createTodo(newTodo);

        dispatch({
          type: 'createTodo',
          payload: responseNewTodo,
        });

        setTitle('');
      } catch (error) {
        dispatch({
          type: 'error',
          payload: ErrorMessage.Creating,
        });
      } finally {
        titleRef.current?.focus();
        dispatch({
          type: 'createTempTodo',
          payload: null,
        });
      }
    } else {
      dispatch({
        type: 'error',
        payload: ErrorMessage.EmptyTitle,
      });
      titleRef.current?.focus();
    }
  };

  const closeErrorMessage = () => {
    dispatch({ type: 'error', payload: ErrorMessage.None });
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => dispatch(
        { type: 'error', payload: ErrorMessage.None },
      ), 3000);
      titleRef.current?.focus();
    }
  }, [errorMessage, dispatch]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

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
              onChange={createTitle}
              ref={titleRef}
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
      <button
        type="button"
        onClick={() => {
          titleRef.current?.focus();
        }}
      >
        Button
        {' '}

      </button>
    </div>
  );
};
