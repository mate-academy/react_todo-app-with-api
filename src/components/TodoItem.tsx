import React, { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDelete?: (id: number) => void;
  onToggle?: (todo: Todo) => void;
  isLoading?: boolean;
  onRename?: (id: number, title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  isLoading,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editingStarted, setEditingStarted] = useState(false);

  const startEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditingStarted(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditingStarted(false);
  };

  const commitEdit = () => {
    const trimmed = editTitle.trim();

    if (!trimmed) {
      onDelete?.(todo.id);
      setEditingStarted(true);

      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);
      setEditingStarted(false);

      return;
    }

    onRename?.(todo.id, trimmed);
    setEditingStarted(true);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEdit();
    }

    if (event.key === 'Enter') {
      commitEdit();
    }
  };

useEffect(() => {
  if (
    editingStarted &&
    !isLoading &&
    editTitle.trim() === todo.title
  ) {
    setIsEditing(false);
    setEditingStarted(false);
  }
}, [isLoading, editingStarted, editTitle, todo.title]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo)}
          aria-label="Toggle todo"
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editTitle}
          autoFocus
          onChange={event => setEditTitle(event.target.value)}
          onBlur={commitEdit}
          onKeyUp={handleKeyUp}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={startEdit}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isLoading}
          onClick={() => onDelete?.(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
