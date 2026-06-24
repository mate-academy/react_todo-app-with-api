import cn from 'classnames';
import React from 'react';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  editTodo: Todo | null;
  editTitle: string;
  onDelete: (id: number) => void;
  onStatusToggle: (todo: Todo) => void;
  onEditStart: (todo: Todo) => void;
  onEditChange: (value: string) => void;
  onEditSave: (isCancel: boolean) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  editTodo,
  editTitle,
  onDelete,
  onStatusToggle,
  onEditStart,
  onEditChange,
  onEditSave,
  editInputRef,
}) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onStatusToggle(todo)}
        />
      </label>

      {todo.id === editTodo?.id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            editInputRef.current?.blur();
            // onEditSave(false);
          }}
        >
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => onEditChange(event.target.value)}
            onBlur={() => onEditSave(false)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                onEditSave(true);
              }
            }}
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
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
