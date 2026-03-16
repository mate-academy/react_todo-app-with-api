/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isSubmitting: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (id: number, completed: boolean) => void;
  onUpdate?: (id: number, data: { title: string }) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isSubmitting,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatingTitle, setUpdatingTitle] = useState(todo.title);

  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setUpdatingTitle(todo.title);
  };

  const handleSave = () => {
    const trimmed = updatingTitle.trim();

    if (trimmed === todo.title) {
      return setIsEditing(false);
    }

    if (trimmed.length === 0) {
      return onDelete?.(todo.id);
    }

    onUpdate?.(todo.id, { title: trimmed })
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {});
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setUpdatingTitle(todo.title);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo.id, todo.completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={editFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder={todo.title}
            value={updatingTitle}
            onChange={event => setUpdatingTitle(event.target.value)}
            onBlur={handleSave}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title" onDoubleClick={handleDoubleClick}>
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isSubmitting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
