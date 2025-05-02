/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from './TodoLoader';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  isUpdating: boolean;
  isEditing: boolean;
  editTitle: string;
  setEditTitle: (title: string) => void;
  onEditStart: (id: number, title: string) => void;
  onEditSubmit: (id: number, oldTitle: string) => void;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  isUpdating,
  isEditing,
  editTitle,
  setEditTitle,
  onEditStart,
  onEditSubmit,
  onToggle,
  onDelete,
  editInputRef,
}) => {
  const { id, title, completed } = todo;

  const handleKeyDown = (e: React.KeyboardEvent, oldTitle: string) => {
    if (e.key === 'Escape') {
      setEditTitle(oldTitle);
      onEditStart(-1, '');
    }
  };

  const handleBlur = (oldTitle: string) => {
    if (editTitle.trim() !== oldTitle) {
      onEditSubmit(todo.id, oldTitle);
    } else {
      setEditTitle(oldTitle);
      onEditStart(-1, '');
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle(id, completed)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            onEditSubmit(id, title);
          }}
        >
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={() => handleBlur(title)}
            onKeyDown={e => handleKeyDown(e, title)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEditStart(id, title)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
            disabled={isDeleting || isUpdating}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader isActive={isDeleting || isUpdating} />
    </div>
  );
};
