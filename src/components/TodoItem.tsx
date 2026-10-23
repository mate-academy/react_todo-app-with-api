import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => Promise<void>;
  onToggle?: (todo: Todo) => void;
  onRename?: (id: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleSubmit = (event?: React.SyntheticEvent) => {
    event?.preventDefault();

    if (isLoading) {
      return;
    }

    const normalized = editedTitle.trim();

    if (normalized === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!normalized) {
      onDelete?.(todo.id);

      return;
    }

    onRename?.(todo.id, normalized)
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label htmlFor={String(todo.id)} className="todo__status-label">
        <input
          id={String(todo.id)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo)}
          aria-label="TodoStatusLabel"
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <>
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
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
