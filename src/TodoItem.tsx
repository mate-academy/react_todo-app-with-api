import React from 'react';
import { Todo } from './types/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  onEditStart: (id: number, title: string) => void;
  onEditSave: (id: number) => void;
  editingId: number | null;
  editTitle: string;
  onEditTitleChange: (title: string) => void;
  onEditCancel: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  isDeleting = false,
  isLoading = false,
  onEditStart,
  onEditSave,
  editingId,
  editTitle,
  onEditTitleChange,
  onEditCancel,
}) => {
  const isTemp = todo.id === 0;
  const showLoader = isTemp || isDeleting || isLoading;

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          disabled={isTemp || isDeleting || isLoading}
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className="sr-only">Toggle todo</span>
      </label>
      {editingId === todo.id ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editTitle}
          onChange={e => onEditTitleChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onEditSave(todo.id);
            } else if (e.key === 'Escape') {
              onEditCancel();
            }
          }}
          onBlur={() => onEditSave(todo.id)}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onEditStart(todo.id, todo.title)}
        >
          {todo.title}
        </span>
      )}
      {editingId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isTemp || isDeleting}
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${showLoader ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
