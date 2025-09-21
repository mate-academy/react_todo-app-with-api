/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => Promise<void>;
  isProcessed: boolean;
  onToggleStatus: (todoId: number, completed: boolean) => Promise<void>;
  onTitleEdit: (
    todoId: number,
    completed: boolean,
    newTitle: string,
  ) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isProcessed,
  onToggleStatus,
  onTitleEdit,
}) => {
  const { title, id, completed } = todo;
  const [isEditFormActive, setIsEditFormActive] = useState(false);
  const [newTitle, setNewTitle] = useState(`${title}`);

  const editTitle = () => {
    let promise: Promise<void>;

    if (newTitle) {
      if (newTitle === title) {
        promise = Promise.resolve();
      } else {
        promise = onTitleEdit(id, completed, newTitle);
      }
    } else {
      promise = onDelete(id);
    }

    promise.then(() => setIsEditFormActive(false)).catch(() => {});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    editTitle();
  };

  document.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
      setIsEditFormActive(false);
    }
  });

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onDoubleClick={() => setIsEditFormActive(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggleStatus(id, !completed)}
          disabled={isProcessed}
        />
      </label>

      {!isEditFormActive && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete(id);
            }}
          >
            ×
          </button>
        </>
      )}

      {isEditFormActive && (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            autoFocus={true}
            onBlur={() => {
              editTitle();
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
