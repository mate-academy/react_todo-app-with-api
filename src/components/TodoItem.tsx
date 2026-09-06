/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessing: boolean;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, completed: boolean) => void;
  onRename: (id: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessing,
  onDelete,
  onStatusChange,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const handleEditStart = () => {
    setIsEditing(true);
    setEditingTitle(todo.title);
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    onRename(todo.id, trimmedTitle)
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {});
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onStatusChange(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editingTitle}
            onChange={event => setEditingTitle(event.target.value)}
            onBlur={() => handleSubmit()}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsEditing(false);
              }
            }}
            disabled={isProcessing}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditStart}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isProcessing ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
