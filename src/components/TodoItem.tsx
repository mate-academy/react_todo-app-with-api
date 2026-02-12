import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  isDeleting?: boolean;
  onDelete?: (id: number) => void;
  isUpdating?: boolean;
  onToggle?: (id: number, completed: boolean) => void;
  onUpdate: (id: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  isDeleting,
  isUpdating,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const showLoader = isTemp || isDeleting || isUpdating;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleBlurSubmit = () => {
    const trimmed = editTitle.trim();

    if (!trimmed) {
      onDelete?.(todo.id);

      return;
    }

    if (trimmed !== todo.title && onUpdate) {
      onUpdate(todo.id, trimmed)
        .then(() => setIsEditing(false))
        .catch(() => {});
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }

    if (event.key === 'Enter') {
      handleBlurSubmit();
    }
  };

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <div className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo.id, !todo.completed)}
          disabled={isUpdating || isDeleting}
        />
      </div>

      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onBlur={handleBlurSubmit}
          onKeyUp={handleKeyUp}
          disabled={isUpdating}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      <div
        data-cy="TodoLoader"
        className={`todo__loader ${showLoader ? 'is-active' : ''}`}
      ></div>

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete?.(todo.id)}
        >
          ×
        </button>
      )}
    </div>
  );
};
