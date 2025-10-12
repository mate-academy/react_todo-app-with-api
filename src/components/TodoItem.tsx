import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number, next: boolean) => void;
  onRename: (id: number, title: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  isUpdating,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const savingRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  // TodoItem.tsx
  const save = async () => {
    if (savingRef.current) {
      return;
    }

    savingRef.current = true;

    const trimmed = draft.trim();

    if (trimmed === '') {
      const ok = await onRename(todo.id, '');

      if (ok) {
        setIsEditing(false);
      } else {
        setTimeout(() => inputRef.current?.focus(), 0);
      }

      savingRef.current = false;

      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);
      savingRef.current = false;

      return;
    }

    const ok = await onRename(todo.id, trimmed);

    if (ok) {
      setIsEditing(false);
    } else {
      setTimeout(() => inputRef.current?.focus(), 0);
    }

    savingRef.current = false;
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={isDeleting}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            className="todo__title-field"
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void save();
              }

              if (e.key === 'Escape') {
                setDraft(todo.title);
                setIsEditing(false);
              }
            }}
            onBlur={() => {
              if (!savingRef.current) {
                void save();
              }
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting || isUpdating ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
