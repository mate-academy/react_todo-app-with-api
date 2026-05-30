import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  editingValue: string;
  onToggle: (todo: Todo) => void;
  onDelete: (id: Todo['id']) => void;
  onStartEdit: (todo: Todo) => void;
  onEditChange: (value: string) => void;
  onSaveEdit: (todo: Todo) => void;
  onCancelEdit: () => void;
};

export const TodoItem = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      todo,
      isLoading,
      isEditing,
      editingValue,
      onToggle,
      onDelete,
      onStartEdit,
      onEditChange,
      onSaveEdit,
      onCancelEdit,
    },
    ref,
  ) => {
    const handleDoubleClick = () => {
      onStartEdit(todo);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        onCancelEdit();

        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        onSaveEdit(todo);
      }
    };

    return (
      <div
        ref={ref}
        className={classNames('todo', { completed: todo.completed })}
        data-cy="Todo"
      >
        <label
          className="todo__status-label"
          htmlFor={`todo-status-${todo.id}`}
          aria-label={`Toggle ${todo.title}`}
        >
          <input
            id={`todo-status-${todo.id}`}
            data-cy="TodoStatus"
            className="todo__status"
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
            disabled={isLoading}
          />
        </label>

        {isEditing ? (
          <div>
            <input
              autoFocus
              data-cy="TodoTitleField"
              className="todo__title-field"
              value={editingValue}
              onChange={event => onEditChange(event.target.value)}
              onBlur={() => onSaveEdit(todo)}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : (
          <>
            <div
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </div>

            <button
              type="button"
              data-cy="TodoDelete"
              className="todo__remove"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

        <div className={classNames('overlay', { 'is-active': isLoading })}>
          <div
            data-cy="TodoLoader"
            className={classNames('loader', { 'is-active': isLoading })}
          />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
