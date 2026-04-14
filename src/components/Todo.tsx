import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  onDelete?: (id: number) => void;
  onToggle?: (id: number, completed: boolean) => void;
  onRename?: (id: number, title: string) => void;
  isLoading?: boolean;
};

export const Todo: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  onRename,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (isEditing && editFieldRef.current) {
      editFieldRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    isSubmitting.current = false;
    setIsEditing(false);
  }, [todo.title]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setNewTitle(todo.title);
  };

  const handleCancel = () => {
    isSubmitting.current = false;
    setIsEditing(false);
    setNewTitle(todo.title);
  };

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!isEditing || isSubmitting.current || isLoading) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);
      return;
    }

    if (!trimmedTitle) {
      onDelete?.(todo.id);
      return;
    }

    isSubmitting.current = true;

    if (onRename) {
      onRename(todo.id, trimmedTitle);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCancel();
    }

    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo.id, !todo.completed)}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            ref={editFieldRef}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </form>
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
            onClick={() => onDelete?.(todo.id)}
            disabled={isLoading}
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
    </li>
  );
};
