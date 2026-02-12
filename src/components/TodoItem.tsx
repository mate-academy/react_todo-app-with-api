/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { FormEvent, KeyboardEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isProcessing?: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  onUpdateTitle?: (newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  onUpdateTitle,
  isProcessing,
}) => {
  const { id, title, completed } = todo;

  const [isEdited, setIsEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  function handleDeleteClick() {
    onDelete(id);
  }

  function handleChangeStatus() {
    onToggle(id, !completed);
  }

  async function handleBlurInputTitle(event?: FormEvent) {
    event?.preventDefault();

    const trimmed = newTitle.trim();

    if (trimmed === title) {
      setIsEdited(false);

      return;
    }

    if (!trimmed) {
      onDelete(id);

      return;
    }

    await onUpdateTitle?.(trimmed);
    setIsEdited(false);
    setNewTitle(trimmed);
  }

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setIsEdited(false);
      setNewTitle(title);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      onDoubleClick={() => {
        setIsEdited(true);
        setNewTitle(title);
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeStatus}
        />
      </label>

      {isEdited ? (
        <form onSubmit={handleBlurInputTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleBlurInputTitle}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteClick}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
