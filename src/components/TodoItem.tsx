/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  isLoaderActive?: boolean;
  onDelete?: (todoId: number) => Promise<void>;
  onUpdate?: (todo: Todo) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoaderActive,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const editFieldRef = useRef<HTMLInputElement>(null);

  const { id, title, completed } = todo;

  useEffect(() => {
    if (isEditing && editFieldRef.current) {
      editFieldRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete?.(todo.id);

      return;
    }

    try {
      await onUpdate?.({ ...todo, title: trimmedTitle });
      setIsEditing(false);
    } catch {
      if (editFieldRef.current) {
        editFieldRef.current.focus();
      }
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate?.({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={editFieldRef}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          {id !== 0 && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete?.(id)}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoaderActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
