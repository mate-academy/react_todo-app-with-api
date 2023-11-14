/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import * as todoService from '../../../api/todos';

import {
  DispatchContext,
  StateContext,
  USER_ID,
} from '../../../TodoStore';
import { actionCreator } from '../../../reducer';
import { TodoError } from '../../../types/TodoError';

export const TodoHeader: React.FC = () => {
  const {
    initialTodos,
    isSubmitting,
    isDeleting,
    isEditing,
  } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [title, setTitle] = useState('');
  const focusedInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedInput.current && !isDeleting && !isEditing) {
      focusedInput.current.focus();
    }
  }, [isSubmitting, isDeleting, isEditing]);

  const handleSubmit = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      dispatch(actionCreator.addError(TodoError.ErrorTodo));

      return;
    }

    dispatch(actionCreator.addTempTodo({
      id: 0, title: title.trim(), userId: USER_ID, completed: false,
    }));
    dispatch(actionCreator.addLoadingItemId(0));
    dispatch(actionCreator.toggleSubmitting());
    dispatch(actionCreator.clearError());
    todoService.addTodo({
      title: title.trim(), userId: USER_ID, completed: false,
    })
      .then(newTodo => {
        dispatch(actionCreator.updateTodos({ add: newTodo }));
      })
      .catch(error => {
        dispatch(actionCreator.addError(TodoError.ErrorAdd));
        throw error;
      })
      .then(() => setTitle(''))
      .finally(() => {
        dispatch(actionCreator.addTempTodo(null));
        dispatch(actionCreator.toggleSubmitting());
        dispatch(actionCreator.clearLoadingItemsId());
      });
  }, [dispatch, title]);

  const handleCompletedAll = useCallback(() => {
    const updatedTodos = initialTodos.filter(initTodo => (
      initialTodos.every(todo => todo.completed)
        ? true
        : !initTodo.completed
    ));
    const updatePromises = updatedTodos.map(todo => {
      dispatch(actionCreator.addLoadingItemId(todo.id));

      return todoService.updateTodo({ ...todo, completed: !todo.completed });
    });

    dispatch(actionCreator.clearError());
    dispatch(actionCreator.toggleUpdating());
    Promise.all(updatePromises)
      .then(response => {
        response.forEach(todo => {
          dispatch(actionCreator.updateTodos({ update: todo }));
        });
      })
      .catch(() => dispatch(actionCreator.addError(TodoError.ErrorUpdate)))
      .finally(() => {
        dispatch(actionCreator.clearLoadingItemsId());
        dispatch(actionCreator.toggleUpdating());
      });
  }, [dispatch, initialTodos]);

  return (
    <header className="todoapp__header">
      {!!initialTodos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: initialTodos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleCompletedAll}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          ref={focusedInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
