/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React from 'react';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  newTitle: string;
  inputRef: React.RefObject<HTMLInputElement>;
  loading: boolean;
  disabled: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isEditing,
  newTitle,
  inputRef,
  loading,
  disabled,
  onToggle,
  onEdit,
  onChange,
  onBlur,
  onKeyDown,
  onDelete,
}) => {
  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
          disabled={disabled}
        />
      </label>
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            disabled={disabled}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onEdit}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
            disabled={disabled}
          >
            x
          </button>
        </>
      )}
      {loading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter"></div>
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};
