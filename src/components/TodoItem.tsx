/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { FormEvent, KeyboardEvent, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessing?: boolean;
  onDelete?: (todoId: number) => Promise<void>;
  onToggle?: (updatedTodo: Todo) => void;
  onUpdateTitle?: (newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  onUpdateTitle,
  isProcessing = false,
}) => {
  const { id, title, completed } = todo;

  const [isEdited, setIsEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const canDelete = !!onDelete && !isProcessing;
  const canToggle = !!onToggle && !isProcessing;
  const canEdit = !!onUpdateTitle && !isProcessing;

  async function handleDeleteClick() {
    await onDelete?.(id);
  }

  function handleChangeStatus() {
    onToggle?.({ ...todo, completed: !completed });
  }

  async function handleBlurInputTitle(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      setIsEdited(false);

      return;
    }

    if (!trimmedTitle) {
      try {
        await onDelete?.(id);
        setIsEdited(false);
      } catch {
        // keep edit form open
      }

      return;
    }

    if (!onUpdateTitle) {
      setIsEdited(false);
      setNewTitle(title);

      return;
    }

    await onUpdateTitle(trimmedTitle);

    setIsEdited(false);
    setNewTitle(trimmedTitle);
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
        if (!canEdit) {
          return;
        }

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
          disabled={!canToggle}
        />
      </label>

      {isEdited ? (
        <form onSubmit={handleBlurInputTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={() => void handleBlurInputTitle()}
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
            onClick={() => void handleDeleteClick()}
            disabled={!canDelete}
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
