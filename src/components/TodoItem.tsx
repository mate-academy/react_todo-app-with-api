/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useEffect, useRef, useState } from 'react';
import { ErrorMessages } from '../types/enums';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onToggleStatus: (id: number, completed: boolean) => Promise<void>;
  onUpdateTitle: (id: number, title: string) => Promise<void>;
  setError: (message: ErrorMessages) => void;
  isAdding?: boolean;
  isEditing?: boolean;
  setIsEditing?: (isEditing: number | null) => void;
  onDoubleClick?: () => void;
  error: ErrorMessages;
}

export const TodoItem: FC<TodoItemProps> = ({
  todo,
  onDelete,
  onToggleStatus,
  onUpdateTitle,
  setError,
  isAdding,
  isEditing,
  onDoubleClick,
  error,
  setIsEditing,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = async () => {
    setIsDeletingItem(true);
    try {
      await onDelete(todo.id);
    } catch {
      setError(ErrorMessages.DELETING_TODOS);
    } finally {
      setIsDeletingItem(false);
    }
  };

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      await onToggleStatus(todo.id, !todo.completed);
    } catch {
      setError(ErrorMessages.UPDATE_TODOS);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUpdating(true);

    try {
      await onUpdateTitle(todo.id, newTitle.trim());
    } catch {
      setError(ErrorMessages.UPDATE_TODOS);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleEditSubmit(event);
      if (setIsEditing) {
        setIsEditing(null);
      }
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleEditSubmit(event);
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(ErrorMessages.DEFAULT);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error, ErrorMessages]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusToggle}
          disabled={isUpdating || isDeletingItem}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            value={newTitle}
            className="todo__title-field"
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={handleCancelEdit}
            onBlur={handleBlur}
            disabled={isUpdating}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={onDoubleClick}
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
          disabled={isUpdating || isDeletingItem}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isUpdating || isDeletingItem || isAdding,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
