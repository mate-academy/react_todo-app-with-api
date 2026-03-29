import React, { useEffect, useRef, useState } from 'react';
import { TodoItemProps } from '../types/TodoItemProps';
import cn from 'classnames';

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  onDelete,
  isDeleteDisabled = false,
  onToggle,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
  onSubmitTitle,
}) => {
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);
  const isCancellingRef = useRef(false);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    setDraftTitle(todo.title);
    isSubmittingRef.current = false;
    isCancellingRef.current = false;

    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(todo.title.length, todo.title.length);
  }, [isEditing, todo.title]);

  const commitChanges = async () => {
    if (!onSubmitTitle) {
      return;
    }

    if (isCancellingRef.current) {
      isCancellingRef.current = false;

      return;
    }

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    try {
      await onSubmitTitle(todo.id, draftTitle);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await commitChanges();
  };

  const handleInputBlur = async () => {
    await commitChanges();
  };

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      isCancellingRef.current = true;
      onCancelEdit?.();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo.id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={draftTitle}
            onChange={event => setDraftTitle(event.target.value)}
            onBlur={handleInputBlur}
            onKeyUp={handleInputKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={event => {
              event.preventDefault();
              onStartEdit?.(todo.id);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete ? () => onDelete(todo.id) : undefined}
            disabled={isDeleteDisabled || !onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
          'is-hidden': !isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
