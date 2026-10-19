import React, { useState, useRef } from 'react';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onToggle: (on: Todo) => void;
  onUpdateTitle: (todo: Todo, title: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const isSaving = useRef(false);

  const handleDoubleClick = () => {
    if (isLoading) {
      return;
    }

    setEditedTitle(todo.title);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (isSaving.current) {
      return;
    }

    isSaving.current = true;

    try {
      const success = await onUpdateTitle(todo, editedTitle);

      if (success) {
        setIsEditing(false);
      }
    } finally {
      isSaving.current = false;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancelEdit();
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Toggle todo status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => void handleSave()}
            autoFocus
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
            disabled={isLoading}
          >
            ×
          </button>
        </>
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
