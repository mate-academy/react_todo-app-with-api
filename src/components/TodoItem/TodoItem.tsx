/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type TodoItemProps = {
  todo: Todo;
  isEditing: boolean;
  editedTitle: string;
  isProcessing: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onStartEditing: () => void;
  onTitleChange: (title: string) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isEditing,
  editedTitle,
  isProcessing,
  onToggle,
  onDelete,
  onStartEditing,
  onTitleChange,
  onSaveEditing,
  onCancelEditing,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
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
        <form
          onSubmit={event => {
            event.preventDefault();
            onSaveEditing();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            autoFocus
            onChange={event => onTitleChange(event.target.value)}
            onBlur={onSaveEditing}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                onCancelEditing();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onStartEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div
          className={classNames('modal-background', {
            'has-background-white-ter': true,
          })}
        />
        <div className="loader" />
      </div>
    </div>
  );
};
