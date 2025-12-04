/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (id: number, nextCompleted: boolean) => void;
  onUpdateTitle?: (id: number, title: string) => Promise<boolean>;
};

export const Todo: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  const handleStartEditing = () => {
    setTitle(todo.title);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleCancelEditing();
    }
  };

  const handleCommitEditing = async () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      onDelete?.(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const isUpdated = await (onUpdateTitle?.(todo.id, trimmedTitle) ??
      Promise.resolve(false));

    if (isUpdated) {
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
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

      {!isEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleStartEditing}
        >
          {todo.title}
        </span>
      )}

      {isEditing && (
        <form
          onSubmit={e => {
            e.preventDefault();
            void handleCommitEditing();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => void handleCommitEditing()}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete?.(todo.id)}
          disabled={isLoading}
        >
          ×
        </button>
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
