/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../api/types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  isLoading: boolean;
  isEditing: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onRename: (id: number, title: string) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  isLoading,
  isEditing,
  onRename,
  onStartEditing,
  onCancelEditing,
  onDelete,
  onToggle,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const titleFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      titleFieldRef.current?.focus();
    }
  }, [isEditing]);

  return (
    // {loadingIds.includes(todo.id) && <Loader />}
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      {isEditing ? (
        <input
        ref={titleFieldRef}
        data-cy="TodoTitleField"
        className="todo__title-field"
        value={editedTitle}
        onChange={event => setEditedTitle(event.target.value)}
        onBlur={() => {
          const newTitle = editedTitle.trim();

          if (newTitle === todo.title) {
            onCancelEditing();
            return;
          }

          if (!newTitle) {
            onDelete(todo.id);
            return;
          }

          onRename(todo.id, newTitle);
        }}
        onKeyUp={event => {
          if (event.key === 'Escape') {
            onCancelEditing();
            return;
          }

          if (event.key === 'Enter') {
            const newTitle = editedTitle.trim();

            if (newTitle === todo.title) {
              onCancelEditing();
              return;
            }

            if (!newTitle) {
              onDelete(todo.id);
              return;
            }

            onRename(todo.id, newTitle);
          }
        }}
      />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onStartEditing}
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
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting || isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
