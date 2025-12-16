/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  loading: boolean;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onRename: (newTitle: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  onToggle,
  onDelete,
  onRename,
}) => {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEditing = () => {
    if (loading) {
      return;
    }

    setDraftTitle(todo.title);
    setEditing(true);
  };

  const canceEditing = () => {
    setEditing(false);
    setDraftTitle(todo.title);
  };

  const submitEditing = async () => {
    const trimmed = draftTitle.trim();

    if (!trimmed) {
      try {
        await onDelete(String(todo.id));
        setEditing(false);
      } catch {}

      return;
    }

    if (trimmed === todo.title) {
      setEditing(false);

      return;
    }

    try {
      await onRename(trimmed);
      setEditing(false);
    } catch {}
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Escape') {
      canceEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={startEditing}
    >
      <label htmlFor={`todo-status-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={loading}
          onChange={() => onToggle(todo)}
        />
      </label>

      {!editing ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(String(todo.id))}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            submitEditing();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={draftTitle}
            onChange={e => setDraftTitle(e.target.value)}
            onBlur={submitEditing}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loading,
          hidden: !loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
