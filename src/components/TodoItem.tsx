import React, { FormEvent, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: number) => void;
  onToggle: (todoId: number) => void;
  onRename: (todoId: number, title: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const isSavingRef = useRef(false);
  const isCancellingRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleStartEditing = () => {
    if (isLoading) {
      return;
    }

    setEditedTitle(todo.title);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    isCancellingRef.current = true;
    isSavingRef.current = false;

    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (isSavingRef.current || isLoading) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    isSavingRef.current = true;

    const success = await onRename(todo.id, trimmedTitle);

    if (success) {
      setIsEditing(false);
    }

    isSavingRef.current = false;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSave();
  };

  const handleBlur = () => {
    if (isCancellingRef.current) {
      isCancellingRef.current = false;

      return;
    }

    void handleSave();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancelEditing();
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
          onChange={handleToggle}
          disabled={isLoading}
          aria-label="Todo status"
        />
      </label>

      {isEditing ? (
        <form className="todo__form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleStartEditing}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
          disabled={isLoading}
        >
          ×
        </button>
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
    </div>
  );
};
