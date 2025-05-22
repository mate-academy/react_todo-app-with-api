import React from 'react';
import { Todo } from '../types/Todo';

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
  todo,
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
    <div data-cy="Todo" className={`todo${todo.completed ? ' completed' : ''}`}>
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${todo.id}`}
        aria-label="Toggle todo status"
      >
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
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
          {todo.title}
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
        className={`modal overlay${isLoading ? ' is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
