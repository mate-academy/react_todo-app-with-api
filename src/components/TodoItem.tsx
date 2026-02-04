/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: () => void;
  onUpdate?: (todo: Todo) => Promise<void>;
  onRename?: (newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete = () => {},
  onUpdate = () => Promise.resolve(),
  onRename = () => Promise.resolve(),
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [hasError, setHasError] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!isEditing) {
      return;
    }

    const trimmed = newTitle.trim();

    if (trimmed === todo.title) {
      setIsEditing(false);
      setHasError(false);

      return;
    }

    if (!trimmed) {
      onDelete();

      return;
    }

    onRename(trimmed)
      .then(() => {
        setIsEditing(false);
        setHasError(false);
      })
      .catch(() => {
        setHasError(true);
        editRef.current?.focus();
      });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate({ ...todo, completed: !todo.completed })}
          disabled={isLoading}
        />
      </label>

      {!isEditing ? (
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
            onClick={onDelete}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            ref={editRef}
            data-cy="TodoTitleField"
            className={cn('todo__title-field', { 'is-error': hasError })}
            value={newTitle}
            disabled={isLoading}
            onChange={e => setNewTitle(e.target.value)}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                setNewTitle(todo.title);
                setHasError(false);
              }
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
