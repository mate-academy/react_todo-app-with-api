import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onToggle?: (todo: Todo) => void;
  onDelete?: (id: number) => Promise<void>;
  onUpdate?: (id: number, title: string) => Promise<void>;
  onEditingDone?: () => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onToggle,
  onDelete,
  onUpdate,
  onEditingDone,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldSubmitOnBlur = useRef(true);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      shouldSubmitOnBlur.current = true;
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  const handleSubmit = () => {
    const trimmed = editedTitle.trim();

    if (!trimmed) {
      onDelete?.(todo.id)?.then(() => {
        setIsEditing(false);
      });

      return;
    }

    if (trimmed == todo.title) {
      setIsEditing(false);

      return;
    }

    onUpdate?.(todo.id, trimmed)?.then(() => {
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      shouldSubmitOnBlur.current = false; // Блокируем onBlur
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      shouldSubmitOnBlur.current = false; // Блокируем onBlur
      handleCancel();
    }
  };

  const handleBlur = () => {
    if (shouldSubmitOnBlur.current) {
      handleSubmit();
    }
  };

  const handleDoubleClick = () => {
    if (!isLoading) {
      setIsEditing(true);
    }
  };

  return (
    <li
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <div className="todo__view">
        <label className="todo__status-label ">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            disabled={isLoading}
            onChange={() => onToggle?.(todo)}
            aria-label={
              todo.completed ? 'Mark as incomplete' : 'Mark as complete'
            }
          />
        </label>

        {isEditing ? (
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            className="todo__title-field"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled={isLoading}
              onClick={() => onDelete?.(todo.id)}
            >
              ×
            </button>
          </>
        )}
      </div>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
