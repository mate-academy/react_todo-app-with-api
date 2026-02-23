/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onRename: (todo: Todo, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const titleFieldRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);
  const isCancellingRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      titleFieldRef.current?.focus();
    }
  }, [isEditing]);

  const submitRename = () => {
    isSubmittingRef.current = true;

    onRename(todo, editedTitle)
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        isCancellingRef.current = true;
        titleFieldRef.current?.focus();
      })
      .finally(() => {
        isSubmittingRef.current = false;
      });
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
          onChange={() => onToggle(todo)}
        />
      </label>

      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEditing(true);
            setEditedTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      ) : (
        <form
          onSubmit={event => {
            event.preventDefault();
            submitRename();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            ref={titleFieldRef}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                isCancellingRef.current = true;
                setIsEditing(false);
                setEditedTitle(todo.title);
              }
            }}
            onBlur={() => {
              if (isSubmittingRef.current) {
                return;
              }

              if (isCancellingRef.current) {
                isCancellingRef.current = false;

                return;
              }

              submitRename();
            }}
          />
        </form>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isLoading}
        >
          ?
        </button>
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
