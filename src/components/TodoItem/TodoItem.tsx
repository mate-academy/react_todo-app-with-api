import cn from 'classnames';

import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  processedId: number;
  onDelete?: (todoId: number) => void;
  onUpdate?: (updatedTodo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed, userId },
  processedId,
  onDelete,
  onUpdate,
}) => {
  const [isTitleEdited, setIsTitleEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const renameInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renameInput.current) {
      renameInput.current.focus();
    }
  }, [processedId, isTitleEdited]);

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsTitleEdited(false);
    }
  };

  const handleRename = (event: React.FormEvent | React.FocusEvent) => {
    event.preventDefault();
    const trimmedTitle = newTitle.trim();

    if (title === trimmedTitle) {
      setIsTitleEdited(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete?.(id);

      return;
    }

    onUpdate?.({ id, title: trimmedTitle, completed, userId }).then(() => {
      setIsTitleEdited(false);
    });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label" aria-label="status-checkbox">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() =>
            onUpdate?.({ id, title, completed: !completed, userId })
          }
        />
      </label>

      {isTitleEdited ? (
        <form onSubmit={handleRename} onBlur={handleRename}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={renameInput}
            disabled={!!processedId}
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onKeyUp={handleEscape}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsTitleEdited(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': processedId === id })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
