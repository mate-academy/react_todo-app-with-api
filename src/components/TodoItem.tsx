/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading: boolean;
  onUpdate: (updatedTodo: Todo) => void;
};

export const TodoItem: React.FC<Props> = (
  {
    todo,
    onDelete,
    isLoading,
    onUpdate,
  },
) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return;
    }

    setEditing(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setEditing(false);

    if (!title.trim()) {
      onDelete(todo.id);
    } else if (title !== todo.title) {
      onUpdate({ ...todo, title });
    }
  };

  return (
    <div
      className={classNames('todo', ({
        'todo completed': todo.completed,
      }))}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            onUpdate({ ...todo, completed: !todo.completed });
          }}
        />
      </label>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={handleSubmit}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
