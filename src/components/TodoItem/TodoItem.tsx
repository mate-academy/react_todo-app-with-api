/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  isUpdating: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onChangeTitle: (value: string) => void;
  onSaveEdit: (todo: Todo) => void;
  onKeyUpEdit: (e: React.KeyboardEvent<HTMLInputElement>, todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  isUpdating,
  isEditing,
  editingTitle,
  onToggle,
  onDelete,
  onEdit,
  onChangeTitle,
  onSaveEdit,
  onKeyUpEdit,
}) => (
  <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        onClick={() => onToggle(todo)}
        checked={todo.completed}
        disabled={isDeleting || isUpdating}
      />
    </label>

    {isEditing ? (
      <input
        data-cy="TodoTitleField"
        value={editingTitle}
        onChange={e => onChangeTitle(e.target.value)}
        onBlur={() => onSaveEdit(todo)}
        onKeyUp={e => onKeyUpEdit(e, todo)}
        autoFocus
      />
    ) : (
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => onEdit(todo)}
      >
        {todo.title}
      </span>
    )}

    {!isEditing && (
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
        disabled={isDeleting}
      >
        ×
      </button>
    )}

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isDeleting || isUpdating ? 'is-active' : 'hidden'}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
