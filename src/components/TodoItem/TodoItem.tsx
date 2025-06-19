/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/types';

interface Props {
  isOverlayActive?: boolean;
  todo: Todo;
  handleUpdate?: (text: string, id: number) => void;
  deleteTodo?: (value: number) => void;
  toggleTodo?: (value: number, completed: boolean) => Promise<boolean>;
}

export const TodoItem: React.FC<Props> = ({
  isOverlayActive = true,
  todo,
  handleUpdate,
  deleteTodo,
  toggleTodo,
}) => {
  const { id, completed, title } = todo;

  const [editingTitle, setEditingTitle] = useState(title);
  const [isTodoEditing, setIsTodoEditing] = useState<boolean>(false);

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const normalizedTitle = editingTitle.trim();

    if (normalizedTitle === title) {
      setIsTodoEditing(false);

      return;
    }

    if (!normalizedTitle) {
      deleteTodo?.(id);

      return;
    }

    const success = await handleUpdate?.(normalizedTitle, id);

    if (success) {
      setIsTodoEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsTodoEditing(false);
      setEditingTitle(title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo?.(id, !completed)}
        />
      </label>

      {!isTodoEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsTodoEditing?.(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo?.(id)}
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
            autoFocus
            value={editingTitle}
            onChange={event => setEditingTitle(event.target.value)}
            onBlur={() => handleSubmit()}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isOverlayActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
