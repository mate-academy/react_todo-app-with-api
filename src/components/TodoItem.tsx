import React from 'react';

import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  editTitle: string;
  editInputRef: React.RefObject<HTMLInputElement>;

  onToggle: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  onEditStart: (todo: Todo) => void;
  onEditChange: (value: string) => void;
  onEditSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  onEditKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  isEditing,
  editTitle,
  editInputRef,
  onToggle,
  onDelete,
  onEditStart,
  onEditChange,
  onEditSubmit,
  onEditKeyUp,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label htmlFor={`todo-status-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => onToggle(todo)}
        />
      </label>

      {isEditing ? (
        <form className="todo__edit" onSubmit={onEditSubmit}>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={event => onEditChange(event.target.value)}
            onBlur={() => onEditSubmit()}
            onKeyUp={onEditKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEditStart(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isLoading}
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
