import React from 'react';
import classNames from 'classnames';
import { Todo as TodoType } from '../types/Todo';

interface TodoProps {
  todo: TodoType;
  onDelete?: () => void;
  onToggle: () => void;
  onStartEdit?: () => void;
  onEditChange?: (value: string) => void;
  onEditSubmit?: () => void;
  onEditCancel?: () => void;
  onEditBlur?: () => void;
  isEditing?: boolean;
  editValue?: string;
  isProcessed?: boolean;
}

export const Todo: React.FC<TodoProps> = ({
  todo,
  onDelete,
  onToggle,
  onStartEdit,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  onEditBlur,
  isEditing = false,
  editValue = '',
  isProcessed = false,
}) => {
  const inputId = `todo-${todo.id}`;
  const isTempTodo = todo.id === 0;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onEditCancel?.();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      onEditSubmit?.();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <input
        id={inputId}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        aria-labelledby={`todo-title-${todo.id}`}
        onChange={onToggle}
        disabled={isTempTodo || isProcessed}
      />

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editValue}
          onChange={event => onEditChange?.(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={onEditBlur}
          autoFocus
        />
      ) : (
        <span
          id={`todo-title-${todo.id}`}
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={onStartEdit}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && onDelete && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
          disabled={isProcessed}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
