/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (todo: Todo) => Promise<void>;
};
export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const saveTitle = () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle === '') {
      onDelete?.(todo.id);

      return;
    }

    onUpdate?.({ ...todo, title: trimmedTitle })
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate?.({ ...todo, completed: !todo.completed })}
        />
      </label>
      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            saveTitle();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            autoFocus
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsEditing(false);
              }
            }}
            onBlur={saveTitle}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setEditTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div
          className="modal-background
                      has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
