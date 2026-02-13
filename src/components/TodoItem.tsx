/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo, TodoChangeOptions } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (id: number) => Promise<void>;
  onUpdate?: (id: number, changes: TodoChangeOptions) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(title);

  useEffect(() => {
    setTitleInput(title);
  }, [title]);

  const onSubmit = async () => {
    const trimmedTitle = titleInput.trim();

    if (title === trimmedTitle) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      try {
        await onDelete(id);
        setIsEditing(false);
      } catch {
        setTitleInput(title);
      }

      return;
    }

    try {
      await onUpdate?.(id, { title: trimmedTitle });
      setIsEditing(false);
    } catch {
      // Keep edit mode open so user can retry
    }
  };

  const handleUpdateCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitleInput(title);
      setIsEditing(false);
      event.preventDefault();
    }
  };

  const activateEditMode = () => {
    setTitleInput(title);
    setIsEditing(true);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
          onChange={() => onUpdate?.(id, { completed: !completed })}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={activateEditMode}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            data-cy="TodoTitleField"
            autoFocus
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            onBlur={onSubmit}
            onKeyUp={handleUpdateCancel}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
