import React, { useEffect, useRef, useState } from 'react';
import './TodoItem.scss';

import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loading: boolean;
  isSelected: boolean;
  onUpdate: (title?: string) => void;
  onDelete: () => void;
  setErrorMessage: (message: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed },
  loading,
  isSelected,
  onUpdate,
  onDelete,
  setErrorMessage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const todoInputEditRef = useRef<HTMLInputElement>(null);

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    const newTitle = editedTitle.trim();

    if (newTitle === title) {
      setIsEditing(false);
      return;
    }

    if (!newTitle) {
      try {
        await onDelete();
      } catch (error) {
        setErrorMessage('Unable to delete a todo');
      }
      return;
    }

    try {
      await onUpdate(newTitle);
      setIsEditing(false);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    }
  };

  const handleDoubleClickEditTodo = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && todoInputEditRef.current) {
      todoInputEditRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
        selected: isSelected,
      })}
    >
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate()}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            ref={todoInputEditRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClickEditTodo}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
