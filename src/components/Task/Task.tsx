/* eslint-disable jsx-a11y/no-autofocus */
import React, {
  useCallback, useEffect, useState,
} from 'react';

import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  loading?: boolean
  deleteTodo?: (id: string) => Promise<void>
  updateTodo?: (id: number, checkStatus: Partial<Todo>)
  => Promise<void>
};

const Task: React.FC<Props> = React.memo(({
  todo,
  loading = false,
  deleteTodo,
  updateTodo,
}) => {
  const [showSpinner, setShowSpinner] = useState(false);

  const [editText, setEditText] = useState(todo.title);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setShowSpinner(loading);
    setEditText(todo.title);
  }, [loading, todo.title]);

  const onDeleteHandler = useCallback(
    () => {
      if (deleteTodo) {
        setShowSpinner(true);

        deleteTodo(String(todo.id)).finally(() => {
          setShowSpinner(false);
        });
      }
    }, [deleteTodo],
  );

  const onToggleCompleteHandler = useCallback(() => {
    if (updateTodo) {
      setShowSpinner(true);

      updateTodo(todo.id, { completed: !todo.completed }).finally(() => {
        setShowSpinner(false);
      });
    }
  }, [updateTodo, todo.completed]);

  const onDoubleClickHandler = useCallback(() => {
    setEditMode(true);
  }, []);

  const onEditHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditText(event.target.value);
    }, [],
  );

  const onKeyHandler
    = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Escape') {
        setEditMode(false);
        setEditText(todo.title);

        return;
      }

      if (updateTodo && event.code === 'Enter') {
        if (!editText.length) {
          setShowSpinner(true);
          onDeleteHandler();

          return;
        }

        if (todo.title === editText) {
          setEditMode(false);

          return;
        }

        setShowSpinner(true);

        updateTodo(todo.id, { title: editText }).finally(() => {
          setShowSpinner(false);
          setEditMode(false);
        });
      }
    };

  const onBlurHandler = () => {
    setEditMode(false);

    if (todo.title !== editText && updateTodo) {
      setShowSpinner(true);

      updateTodo(todo.id, { title: editText }).finally(() => {
        setShowSpinner(false);
      });
    }
  };

  const onSubmitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    }, [],
  );

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={onToggleCompleteHandler}
        />
      </label>

      {editMode ? (
        <form onSubmit={onSubmitHandler}>
          <input
            type="text"
            autoFocus
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editText}
            onBlur={onBlurHandler}
            onChange={onEditHandler}
            onKeyDown={onKeyHandler}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={onDoubleClickHandler}
          >
            {todo.title}
          </span>
          <button
            type="button"
            onClick={onDeleteHandler}
            className="todo__remove"
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', {
        'is-active': showSpinner,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

export { Task };
