/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  isProcessing: boolean;
  onDelete: (id: number) => void;
  onChange: (id: number, completed: boolean) => void;
  disabled?: boolean;
  isEditing?: boolean;
  editingTitle?: string;
  onEditStart?: (todo: Todo) => void;
  onEditCancel?: () => void;
  onEditChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditSubmit?: (todo: Todo, eventType?: 'enter' | 'blur') => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isProcessing,
  onDelete,
  onChange,
  disabled = false,
  isEditing = false,
  editingTitle = '',
  onEditStart,
  onEditCancel,
  onEditChange,
  onEditSubmit,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
      key={todo.id}
      onDoubleClick={() => !isEditing && onEditStart?.(todo)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={disabled}
          onChange={() => onChange(todo.id, !todo.completed)}
        />
      </label>

      {!isEditing ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={disabled}
          >
            ×
          </button>
        </>
      ) : (
        <input
          ref={inputRef}
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={editingTitle}
          onChange={onEditChange}
          onBlur={() => {
            if (editingTitle.trim() === '') {
              inputRef.current?.focus();
              onDelete(todo.id);

              return;
            }

            onEditSubmit?.(todo, 'blur');
          }}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              onEditCancel?.();
            }

            if (event.key === 'Enter') {
              if (editingTitle.trim() === '') {
                event.preventDefault();
                inputRef.current?.focus();

                onDelete(todo.id);

                return;
              }

              onEditSubmit?.(todo, 'enter');
            }
          }}
          disabled={isProcessing}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isProcessing,
          hidden: !isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
