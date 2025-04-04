import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, updates: Partial<Todo>) => Promise<void>;
  isLoading: boolean;
  isUpdatingStatus: boolean;
  isAdding: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  onDelete,
  onUpdate,
  isLoading,
  isUpdatingStatus,
  isAdding,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => setIsEditing(true);

  const handleBlur = () => {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      onDelete(id);
    } else {
      setIsSubmitting(true);
      onUpdate(id, { title: trimmedTitle, completed })
        .then(() => {
          setIsEditing(false);
          setIsSubmitting(false);
        })
        .catch(() => {
          setError('Unable to update a todo');
          setIsSubmitting(false);
        });
    }
  };

  const handleToggle = () => {
    onUpdate(id, { completed: !completed });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(title);
    } else if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const isCurrentlySubmitting = isSubmitting || isLoading || isUpdatingStatus;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
        loading: isCurrentlySubmitting,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
          disabled={isCurrentlySubmitting}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__edit"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Empty todo will be deleted"
        />
      ) : (
        <>
          <span className="todo__title" onDoubleClick={handleEdit}>
            {title}
            {(isCurrentlySubmitting || isAdding) && (
              <div className="loader" />
            )}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
            disabled={isCurrentlySubmitting}
            data-cy="TodoDelete"
          >
            { !isCurrentlySubmitting && '×' }
          </button>
        </>
      )}

      {error && <div className="error-notification">{error}</div>}
    </div>
  );
};
