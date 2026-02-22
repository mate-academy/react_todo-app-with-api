/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading: boolean;
  onPatch: (id: number, data: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onPatch,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  // keep local input in sync when todo title changes (after success update)
  useEffect(() => {
    if (!isEditing) {
      setNewTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleToggleItem = (checked: boolean) => {
    const updated = { ...todo, completed: checked };

    onPatch(todo.id, updated);
  };

  const handleRenameSave = () => {
    if (isLoading) {
      return; // protect from double submit/blur
    }

    const trimmed = newTitle.trim();

    setNewTitle(trimmed);

    if (trimmed === '') {
      onDelete(todo.id);

      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    const updated = { ...todo, title: trimmed };

    onPatch(todo.id, updated)
      .then(() => setIsEditing(false))
      .catch(() => {
        // keep editing on error
        inputRef.current?.focus();
      });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewTitle(todo.title);
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
          onChange={event => handleToggleItem(event.target.checked)}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleRenameSave();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleRenameSave}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                handleCancelEdit();
              }
            }}
            disabled={isLoading}
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
            onClick={() => onDelete(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
