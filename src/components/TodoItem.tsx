/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type EditControls = {
  isEditing: boolean;
  editTitle: string;
  startEdit: () => void;
  changeEditTitle: (value: string) => void;
  submitEdit: () => void;
  cancelEdit: () => void;
};

type Props = {
  todo: Todo;
  isBusy?: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (id: number, newState: boolean) => void;
  editControls: EditControls;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isBusy,
  onDelete,
  onToggle,
  editControls,
}) => {
  const {
    isEditing,
    editTitle,
    startEdit,
    changeEditTitle,
    submitEdit,
    cancelEdit,
  } = editControls;

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitEdit();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => onToggle?.(todo.id, event.target.checked)}
          disabled={isBusy || isEditing}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEdit}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
            disabled={isBusy}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => changeEditTitle(event.target.value)}
            onBlur={submitEdit}
            onKeyUp={handleKeyUp}
            autoFocus
            disabled={isBusy}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': isBusy })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
