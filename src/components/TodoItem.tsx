import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string) => Promise<void>;
  loadingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  loadingIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  const isLoading = todo.id === 0 || loadingIds.includes(todo.id);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!isLoading) {
      setIsEditing(true);
      setEditTitle(todo.title);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const handleSaveEdit = async () => {
    const trimmedTitle = editTitle.trim();

    // If title is the same, just cancel editing
    if (trimmedTitle === todo.title) {
      handleCancelEdit();

      return;
    }

    // If title is empty, delete the todo
    if (!trimmedTitle) {
      try {
        await onDelete(todo.id);
        // Only close edit mode if delete succeeds
        setIsEditing(false);
      } catch {
        // Keep edit mode open on delete error
      }

      return;
    }

    // Update the todo
    try {
      await onUpdate(todo.id, trimmedTitle);
      // Only close edit mode if update succeeds
      setIsEditing(false);
    } catch {
      // Keep edit mode open on error - don't call setIsEditing(false)
      // The error will be shown by the parent component
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* Loader overlay */}
      <div
        data-cy="TodoLoader"
        className={classNames('loader', {
          'is-active': isLoading,
        })}
      />

      {/* Checkbox - always visible */}
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={`todo-status-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        //Edit mode - only show input field
        <input
          ref={editInputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          disabled={isLoading}
        />
      ) : (
        // View mode - show title and delete button
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
            onClick={() => onDelete(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};
