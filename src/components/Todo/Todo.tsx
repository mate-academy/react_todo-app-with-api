import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (todo: number) => void,
  deletingTodoId: number,
  isClearCompleted: boolean,
  onStatusChange: (id: number, data: boolean) => void,
  isToggle: boolean;
  onEditing: (id: number, data: string) => void,
  setEditingId: (id: number) => void
  editingId: number,
};

export const TodoCard: React.FC<Props> = ({
  todo, onDelete, deletingTodoId, isClearCompleted,
  onStatusChange, isToggle, onEditing, editingId,
  setEditingId,
}) => {
  const { id, title, completed } = todo;
  const isClearCompletedActive = completed && isClearCompleted;
  const isTodoLoad = id === deletingTodoId
    || isClearCompletedActive || isToggle;

  const [value, setValue] = useState(title);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => {
            onStatusChange(id, !completed);
          }}
        />
      </label>

      {editingId !== id && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingId(id);
          }}
        >
          {title}
        </span>
      )}

      {editingId === id && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onEditing(id, value);
          }}
        >
          <input
            type="text"
            value={value}
            className="todo__title-field"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </form>
      )}

      {editingId !== id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => {
            onDelete(id);
          }}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTodoLoad,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
