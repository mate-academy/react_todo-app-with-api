/* eslint-disable jsx-a11y/label-has-associated-control */

import { FormEvent, KeyboardEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isProcessing?: boolean;
  onDelete: (todoId: number) => void;
  onToggle: (updatedTodo: Todo) => void;
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

  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(title);

  function handleDeletClick() {
    onDelete(id);
  }

  function handleChangeStatus() {
    onToggle({ ...todo, completed: !completed });
  }

  async function handleBlurInputTitle(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      setIsEdited(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(id);

      return;
    }

    await onUpdateTitle?.(trimmedTitle);

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
      className={classNames('todo', { completed: completed })}
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
          onChange={() => handleChangeStatus()}
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
            onBlur={() => handleBlurInputTitle()}
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
            onClick={handleDeletClick}
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
