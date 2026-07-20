import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isDeleting: boolean;
  isUpdating: boolean;
  isTemp?: boolean;
  editingTodoId: number | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  setEditingTodoId: (id: number | null) => void;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onRename: (todo: Todo) => void;
  mainInputRef: React.RefObject<HTMLInputElement>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  isUpdating,
  isTemp = false,
  editingTodoId,
  editTitle,
  setEditTitle,
  setEditingTodoId,
  onDelete,
  onToggle,
  onRename,
  mainInputRef,
}) => {
  const isEditing = todo.id === editingTodoId;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onRename(todo);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodoId(null);
      mainInputRef.current?.focus();
    }
  };

  const handleDoubleClick = () => {
    if (!isTemp) {
      setEditingTodoId(todo.id);
      setEditTitle(todo.title);
    }
  };

  return (
    <div
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
          readOnly={isTemp}
          onChange={() => !isTemp && onToggle(todo)}
          aria-label="Toggle todo status"
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={editTitle}
            disabled={isDeleting || isUpdating}
            onChange={e => setEditTitle(e.target.value)}
            autoFocus
            onBlur={() => onRename(todo)}
            onKeyDown={handleKeyDown}
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

          {!isTemp && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                onDelete(todo.id);
              }}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeleting || isTemp || isUpdating,
        })}
      >
        <div
          className="modal-background
          has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
