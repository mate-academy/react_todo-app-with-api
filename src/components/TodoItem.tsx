/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: () => void;
  onToggle?: () => void;
  onRename?: (title: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const isSavingRef = useRef(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      titleField.current?.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    setTitle(todo.title);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setTitle(todo.title);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (isSavingRef.current || !onRename) {
      return;
    }

    isSavingRef.current = true;

    onRename(title)
      .then(success => {
        if (success) {
          setIsEditing(false);
        }
      })
      .finally(() => {
        isSavingRef.current = false;
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
          readOnly={!onToggle}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            ref={titleField}
            onChange={event => setTitle(event.target.value)}
            onBlur={handleSave}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onRename ? startEditing : undefined}
          >
            {todo.title}
          </span>

          {onDelete && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onDelete}
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
