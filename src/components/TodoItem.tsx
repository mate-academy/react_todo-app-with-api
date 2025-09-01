/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  isLoading: boolean;
  tempTitle?: string;
  tempStatus?: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggle: (todo: Todo) => void;
  onUpdate: (todo: Todo, isFromTitleEdit: boolean) => void;
  onDelete: (
    todoId: number,
    fromTitleEdit: boolean,
    originalTitle: string,
  ) => void;
  onStartEdit: (todo: Todo) => void;
  onCancelEdit: () => void;
  setEditingTitle: (title: string) => void;
  isCreating: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  tempTitle,
  tempStatus,
  isEditing,
  editingTitle,
  onToggle,
  onUpdate,
  onDelete,
  onStartEdit,
  onCancelEdit,
  setEditingTitle,
  isCreating,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle && trimmedTitle !== todo.title) {
      onUpdate({ ...todo, title: trimmedTitle }, true);
    } else if (!trimmedTitle) {
      onDelete(todo.id, true, todo.title);
    } else {
      onCancelEdit();
    }
  };

  const handleBlur = () => {
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle && trimmedTitle !== todo.title) {
      onUpdate({ ...todo, title: trimmedTitle }, true);
    } else if (!trimmedTitle) {
      onDelete(todo.id, true, todo.title);
    } else {
      onCancelEdit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: tempStatus !== undefined ? tempStatus : todo.completed,
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={tempStatus !== undefined ? tempStatus : todo.completed}
          onChange={() => onToggle(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isCreating}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onStartEdit(todo)}
        >
          {tempTitle || todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id, false, '')}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
