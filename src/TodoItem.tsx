import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';

interface TodoItemProps {
  todo: Todo;
  isDeleting: boolean;
  isUpdating: boolean;
  isEditing: boolean;
  isTemp: boolean;
  editTitle: string;

  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onStartEditing: (todo: Todo) => void;
  onEditTitleChange: (value: string) => void;
  onSubmitEdit: () => void;
  onCancelEdit: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isDeleting,
  isUpdating,
  isEditing,
  isTemp,
  editTitle,
  onDelete,
  onToggle,
  onStartEditing,
  onEditTitleChange,
  onSubmitEdit,
  onCancelEdit,
}) => {
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  const isLoading = isDeleting || isUpdating || isTemp;

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Escape') {
      onCancelEdit();
    }

    if (event.key === 'Enter') {
      onSubmitEdit();
    }
  };

  const handleBlur = (): void => {
    if (isEditing) {
      onSubmitEdit();
    }
  };

  const handleToggle = (): void => {
    onToggle(todo);
  };

  return (
    <article
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
          aria-label={`Mark "${todo.title}" as completed`}
        />
      </label>

      {isEditing ? (
        <form onSubmit={event => event.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            ref={editFieldRef}
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={event => onEditTitleChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onStartEditing(todo)}
          >
            {todo.title}
          </span>

          {!isTemp && (
            <button
              type="button"
              data-cy="TodoDelete"
              className="todo__remove"
              onClick={() => onDelete(todo.id)}
              disabled={isLoading}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </article>
  );
};
