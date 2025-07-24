/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

interface ItemProps {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number) => void;
  onUpdate: (id: number, newTitle: string) => Promise<void>;
}

export const TodoItem: React.FC<ItemProps> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  // const [updateFailed, setUpdateFailed] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const cancelEditing = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const saveEditing = async () => {
    // setUpdateFailed(false);

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (trimmedTitle === '') {
      try {
        await onDelete(todo.id);
        setIsEditing(false);
      } catch {
        setIsEditing(true);
      }
    } else {
      try {
        await onUpdate(todo.id, trimmedTitle);
        setIsEditing(false);
      } catch {
        setIsEditing(true);
        // setUpdateFailed(true);
      }
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => onToggle(todo.id)}
        />
      </label>
      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {isLoading ? editTitle : todo.title}
          </span>

          <button
            aria-label="delete"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isLoading}
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            saveEditing();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={saveEditing}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                cancelEditing();
              }
            }}
            ref={inputRef}
            disabled={isLoading}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
