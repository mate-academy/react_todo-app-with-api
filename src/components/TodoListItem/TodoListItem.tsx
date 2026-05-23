/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import classNames from 'classnames';
import { UpdateTodoForm } from '../UpdateTodoForm';
import { Todo, UpdateTodoDto } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onRemove: (id: Todo['id']) => void;
  onUpdate: (id: Todo['id'], data: UpdateTodoDto) => Promise<void>;
}

export const TodoListItem = ({
  todo,
  isLoading,
  onRemove,
  onUpdate,
}: Props) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEditing = () => {
    setIsEditing(current => !current);
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const handleUpdateStatus = () => {
    onUpdate(id, { completed: !completed });
  };

  const handleUpdateTitle = async (updatedTitle: string) => {
    if (updatedTitle === '') {
      onRemove(id);

      return;
    }

    await onUpdate(id, { title: updatedTitle });
    handleToggleEditing();
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleUpdateStatus}
        />
      </label>

      {isEditing ? (
        <UpdateTodoForm
          title={title}
          onClose={handleToggleEditing}
          onSubmit={handleUpdateTitle}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleToggleEditing}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemove}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
