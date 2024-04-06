import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isShowLoader: boolean;
  onDelete?: (todoId: number) => void;
  onUpdateStatus?: (todo: Todo) => void;
  onUpdateTitle?: (todo: Todo) => Promise<void>;
  inputRef?: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isShowLoader,
  onDelete = () => {},
  onUpdateStatus = () => {},
  onUpdateTitle = () => Promise.resolve(),
  inputRef,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!normalizedTitle) {
      onDelete(todo.id);

      return;
    }

    try {
      await onUpdateTitle({ ...todo, title: normalizedTitle });

      setIsEditing(false);
    } catch (error) {
      if (inputRef) {
        inputRef.current?.focus();
      }
    }
  };

  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus();
    }
  }, [isEditing, inputRef]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label aria-label="Todo status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            onUpdateStatus({ ...todo, completed: !todo.completed })
          }
        />
      </label>

      {!isEditing && (
        <Fragment>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              if (onDelete) {
                onDelete(todo.id);
              }
            }}
          >
            ×
          </button>
        </Fragment>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={inputRef}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsEditing(false);
              }
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isShowLoader })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
