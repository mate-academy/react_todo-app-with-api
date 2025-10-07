/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isTempTodo?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, data: Partial<Todo>) => Promise<void>;
  isDeleting?: boolean;
  isUpdating?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onUpdate,
  isTempTodo = false,
  isDeleting = false,
  isUpdating = false,
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const editInputRef = useRef<HTMLInputElement>(null);

  const isLoading = isTempTodo || isDeleting || isUpdating;

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = async () => {
    if (onUpdate && !isTempTodo) {
      await onUpdate(id, { completed: !completed });
    }
  };

  const handleDoubleClick = () => {
    if (!isTempTodo) {
      setIsEditing(true);
      setEditTitle(title);
    }
  };

  const handleSave = async () => {
    const newTitle = editTitle.trim();

    if (newTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      if (onDelete) {
        onDelete(id);
      }

      return;
    }

    if (onUpdate) {
      try {
        await onUpdate(id, { title: newTitle });
        setIsEditing(false);
      } catch {
        // Error is handled in parent component
        // Stay in editing mode on error
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
          disabled={isTempTodo}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            ref={editInputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          {!isTempTodo && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
