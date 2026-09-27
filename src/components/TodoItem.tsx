import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
  onUpdate?: (todo: Todo) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading = false,
  onUpdate,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleStatusChange = () => {
    if (onUpdate) {
      onUpdate({ ...todo, completed: !completed });
    }
  };

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete?.(id);

      return;
    }

    if (onUpdate) {
      onUpdate({ ...todo, title: trimmedTitle })
        .then(() => setIsEditing(false))
        .catch(() => {
          editInputRef.current?.focus();
        });
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${id}`}
        aria-label="Todo status"
      >
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={() => handleSubmit()}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(id)}
          >
            ×
          </button>
        </>
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
