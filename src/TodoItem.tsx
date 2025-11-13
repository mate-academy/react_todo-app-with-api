/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from './types/Todo';
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading?: boolean;
  onToggle: (id: number) => void;
  onToggleRename: (id: number, editedTitle: string) => void;
  hasError: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading = false,
  onToggle,
  onToggleRename,
  hasError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleRename = () => {
    const normalizedTitle = editedTitle.trim();

    if (normalizedTitle === todo.title) {
      return;
    }

    if (!normalizedTitle) {
      onDelete(todo.id);

      return;
    }

    onToggleRename(todo.id, normalizedTitle);
  };

  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !hasError) {
      setIsEditing(false);
    }

    if (hasError) {
      setIsEditing(true);
    }
  }, [isLoading, hasError]);

  useEffect(() => {
    field.current?.focus();
  }, [isEditing]);

  const handleBlur = () => {
    if (todo.title === editedTitle) {
      setIsEditing(false);
    }

    handleRename();
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      {!isEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {isEditing && (
        <>
          <form
            onSubmit={event => {
              event.preventDefault();

              setIsEditing(false);
              handleRename();
            }}
          >
            <input
              ref={field}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={event => setEditedTitle(event.target.value)}
              onBlur={handleBlur}
              onKeyUp={handleKeyUp}
            />
          </form>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isLoading}
        >
          ×
        </button>
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
