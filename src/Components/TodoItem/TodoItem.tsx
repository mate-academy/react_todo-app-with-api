/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (v: number) => void;
  isLoading: boolean;
  onUpdate: (todo: Todo) => void;
  onUpdateTitle: (todo: Todo, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onUpdate,
  onUpdateTitle,
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const editorFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editorFocus.current?.focus();
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEscBtn = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle.trim() === title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle.length) {
      onDelete(id);

      return;
    }

    if (newTitle !== title) {
      onUpdateTitle(todo, newTitle);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={() => onUpdate(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={editorFocus}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleEscBtn}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', { 'is-active': isLoading })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
