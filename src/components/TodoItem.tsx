/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void | { error: boolean }>;
  todosAreLoadingIds: number[];
  onChange: (todo: Todo) => Promise<void | { error: boolean }>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  todosAreLoadingIds,
  onChange,
}) => {
  const { id, completed, title, userId } = todo;

  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setUpdatedTitle(title);
      setIsEditing(false);
    }
  };

  const handleSubmit = () => {
    if (!updatedTitle.trim()) {
      onDelete(id).then(response => setIsEditing(!!response?.error));
    } else if (updatedTitle !== title && title !== updatedTitle) {
      const updatedTodo = Object.assign({}, todo);

      updatedTodo.title = updatedTitle.trim();
      onChange(updatedTodo).then(response => setIsEditing(!!response?.error));
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            onChange({ id, completed: !completed, title, userId });
          }}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();

            handleSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            autoFocus
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            onChange={event => setUpdatedTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todosAreLoadingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
