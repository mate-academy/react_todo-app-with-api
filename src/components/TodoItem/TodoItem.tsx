/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdate: (
    id: number,
    title: string,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<void>;
  isTemp?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  isUpdating,
  onDelete,
  onToggle,
  onUpdate,
  isTemp = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const trimmed = editingTitle.trim();

    if (!trimmed) {
      onDelete(todo.id);

      return;
    }

    if (trimmed !== todo.title) {
      await onUpdate(todo.id, trimmed, setIsEditing);
    } else {
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setEditingTitle(todo.title);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }

    if (e.key === 'Escape') {
      setEditingTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      key={todo.id}
      className={`todo ${todo.completed ? 'completed' : ''} ${isTemp ? 'loading' : ''}`}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isTemp}
          onChange={() => onToggle(todo.id)}
          data-cy="TodoStatus"
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          className="todo__edit"
          value={editingTitle}
          data-cy="TodoTitleField"
          onChange={e => setEditingTitle(e.target.value)}
          onBlur={handleSave}
          onKeyUp={handleKeyUp}
          autoFocus
        />
      ) : (
        <>
          <span
            className="todo__title"
            data-cy="TodoTitle"
            onDoubleClick={startEditing}
          >
            {todo.title}
          </span>
          {!isTemp && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
              disabled={isDeleting}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting || isTemp || isUpdating ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
