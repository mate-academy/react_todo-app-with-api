import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todoId: Todo['id']) => Promise<unknown>;
  onToggleStatus?: (todoId: Todo['id']) => void;
  onSaveTitle?: (todoId: Todo['id'], newTitle: string) => Promise<unknown>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggleStatus,
  onSaveTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setNewTitle(todo.title);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewTitle(todo.title);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleSaveTitleAction = async () => {
    if (isLoading) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      try {
        if (onDelete) {
          await onDelete(todo.id);
        }
      } catch (error) {}

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      if (onSaveTitle) {
        await onSaveTitle(todo.id, trimmedTitle);
        setIsEditing(false);
      }
    } catch (error) {}
  };

  const handleSaveSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSaveTitleAction();
  };

  const handleSaveBlur = () => {
    handleSaveTitleAction();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={handleDoubleClick}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleStatus && onToggleStatus(todo.id)}
          disabled={isLoading || isEditing}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSaveSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleSaveBlur}
            onKeyDown={handleKeyPress}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete?.(todo.id);
            }}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
