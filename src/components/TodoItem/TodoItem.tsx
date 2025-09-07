/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Actions = {
  onToggle: (todo: Todo) => void;
  onSave: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
};

type Props = {
  todo: Todo;
  isEditing: boolean;
  editingTitle: string;
  isLoading: boolean;
  actions: Actions;
};

export const TodoItem = React.memo(
  forwardRef<HTMLInputElement, Props>(
    ({ todo, isEditing, editingTitle, isLoading, actions }, ref) => {
      const { onToggle, onSave, onChange, onCancel, onEdit, onDelete } =
        actions;

      return (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              id={`todo-status-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => onToggle(todo)}
            />
          </label>

          {isEditing ? (
            <form
              onSubmit={event => {
                event.preventDefault();
                onSave();
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editingTitle}
                onChange={onChange}
                onBlur={onSave}
                onKeyDown={onCancel}
                ref={ref}
                autoFocus
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => onEdit(todo)}
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
            className={classNames('modal overlay', { 'is-active': isLoading })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      );
    },
  ),
);
