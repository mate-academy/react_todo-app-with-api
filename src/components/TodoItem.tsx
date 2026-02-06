import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loading?: boolean;
  onDelete?: (todoId: number) => void;
  onToggle?: (todoId: number, completed: boolean) => void;
  onRename?: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onDelete,
  onToggle,
  onRename,
}) => {
  const { completed, title, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  const handleSave = () => {
    const editTitleTrim = editTitle.trim();

    if (editTitleTrim === title) {
      setIsEditing(false);

      return;
    }

    if (!editTitleTrim) {
      onDelete?.(id);
    } else {
      onRename?.(id, editTitleTrim).then(() => {
        setIsEditing(false);
      });
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
        'is-loading': loading,
      })}
    >
      <label aria-label="todo" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          disabled={loading}
          onChange={event => onToggle?.(id, event.target.checked)}
        />
      </label>

      {isEditing ? (
        <input
          autoFocus
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onKeyUp={handleKeyUp}
          onBlur={handleSave}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={loading}
          onClick={() => onDelete?.(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
