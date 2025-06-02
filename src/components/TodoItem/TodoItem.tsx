import React, { useState } from 'react';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  onUpdate?: (todoId: number, data: object) => void;
  isUpdating: boolean;
  isEditingTitle: boolean;
  setEditingTitleId: (todoId: number | null) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onUpdate = () => {},
  isUpdating,
  isEditingTitle,
  setEditingTitleId = () => {},
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [hasUpdated, setHasUpdated] = useState(false);

  const handleBlur = () => {
    if (hasUpdated) {
      return;
    }

    setHasUpdated(true);

    if (!editedTitle.trim()) {
      onDelete(todo.id);

      return;
    } else if (editedTitle !== todo.title) {
      onUpdate(todo.id, { title: editedTitle.trim() });

      return;
    }

    setEditingTitleId(null);
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          aria-label={`Toggle ${todo.title}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            onUpdate(todo.id, { completed: !todo.completed });
          }}
        />
      </label>

      {isEditingTitle ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editedTitle}
          onChange={event => setEditedTitle(event.target.value)}
          onBlur={handleBlur}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleBlur();
            } else if (event.key === 'Escape') {
              setEditedTitle(todo.title);
              setEditingTitleId(null);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditedTitle(todo.title);
            setHasUpdated(false);
            setEditingTitleId(todo.id);
          }}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isEditingTitle && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isUpdating ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
