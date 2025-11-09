/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useRef, useState } from 'react';

import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  processingIds: number[];
  onDelete?: () => void;
  onToggle?: (id: Todo['id'], todoStatus: Todo['completed']) => void;
  onEdit?: (id: Todo['id'], newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onEdit,
  processingIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isProcessing = processingIds.includes(todo.id) || todo.id === 0;
  const shouldShowLoader =
    isProcessing || isLoading || (isEditing && isSubmitting);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditingTitle(todo.title);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const submitEdit = async () => {
    if (isSubmitting) {
      return;
    }

    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      setIsSubmitting(true);

      try {
        await onDelete?.();
        setIsEditing(false);
      } catch (error) {
        setEditingTitle(todo.title);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    setIsSubmitting(true);

    try {
      await onEdit?.(todo.id, trimmedTitle);
      setIsEditing(false);
    } catch {
      setEditingTitle(todo.title);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitEdit();
  };

  const handleBlur = () => {
    submitEdit();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditingTitle(todo.title);
      setIsSubmitting(false);
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
          disabled={shouldShowLoader}
          onChange={() => onToggle && onToggle(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={event => setEditingTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            ref={inputRef}
            disabled={isSubmitting}
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
            disabled={shouldShowLoader}
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          hidden: !shouldShowLoader,
          'is-active': shouldShowLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
