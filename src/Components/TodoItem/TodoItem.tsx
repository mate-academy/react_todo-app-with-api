/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  loadingIds: number[];
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
  onEdit?: (id: number, NewTitle: string) => void;
};
type SubmitProps =
  | React.FocusEvent<HTMLInputElement>
  | React.KeyboardEvent<HTMLInputElement>
  | React.FormEvent<HTMLFormElement>;

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingIds,
  onDelete = () => {},
  onToggle = () => {},
  onEdit = () => {},
}) => {
  const { title, completed } = todo;
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const inputElem = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputElem.current) {
      inputElem.current.focus();
    }
  }, [editing]);

  const handleCancel = () => {
    setEditing(false);
    setNewTitle(todo.title);
  };

  const handleKeyEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.type === 'keyup') {
      const keyEvent = event as React.KeyboardEvent<HTMLInputElement>;

      if (keyEvent.key === 'Escape') {
        handleCancel();
      }
    }
  };

  function handleSubmit(event: SubmitProps): void {
    event.preventDefault();
    setEditing(false);

    if (newTitle.length === 0) {
      onDelete(todo.id);

      return;
    }

    if (todo.title !== newTitle) {
      onEdit(todo.id, newTitle);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => {
            onToggle(todo.id);
          }}
        />
      </label>

      {!editing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {newTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={e => handleSubmit(e)}>
          <input
            data-cy="TodoTitleField"
            ref={inputElem}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyEvent}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingIds?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
