import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void
  isLoading: boolean;
  onUpdate: (todoId: number) => void
  isUpdating: boolean;
}
export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onUpdate,
  isUpdating,
}) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const { id, title, completed } = todo;
  const handleDelete = (todoId: number) => {
    onDelete(todoId);
    setIsDeleted(true);
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate(id)}
        />
      </label>

      {todo ? (
        <>
          <span className="todo__title">{title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isDeleted || !isLoading || isUpdating },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
