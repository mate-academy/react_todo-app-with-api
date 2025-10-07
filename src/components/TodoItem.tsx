import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  loading: boolean;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onRename: (id: number, newTitle: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  const cancelEdit = () => {
    setTitle(todo.title);
    setIsEditing(false);
  };

  const commitEdit = async () => {
    const newTitle = title.trim();

    if (newTitle === todo.title) {
      cancelEdit();

      return;
    }

    if (!newTitle) {
      try {
        await onDelete(todo.id);
        setIsEditing(false);
      } catch {}

      return;
    }

    try {
      await onRename(todo.id, newTitle);
      setIsEditing(false);
    } catch {}
  };

  const handleBlur = () => {
    commitEdit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      commitEdit();
    } else if (event.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleDoubleClick = () => {
    if (!loading) {
      setIsEditing(true);
    }
  };

  return (
    <li
      className={classNames('todo', {
        completed: todo.completed,
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          aria-label="Toggle todo status"
          className="todo__status"
          data-cy="TodoStatus"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          disabled={loading}
        />
      </label>

      {isEditing ? (
        <form onSubmit={e => e.preventDefault()}>
          <input
            ref={inputRef}
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={loading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
