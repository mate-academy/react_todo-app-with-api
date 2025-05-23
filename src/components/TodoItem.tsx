import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggle: () => void;
  onDelete: () => void;
  onDoubleClick: () => void;
  onChangeTitle: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  isLoading,
  isEditing,
  editingTitle,
  onToggle,
  onDelete,
  onDoubleClick,
  onChangeTitle,
  onBlur,
  onKeyDown,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${id}`}
        aria-label="Toggle todo status"
      >
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onToggle}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={e => onChangeTitle(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={onDoubleClick}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
        >
          ×
        </button>
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
