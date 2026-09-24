/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  const handleSave = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      return setIsEditing(false);
    }

    if (trimmedTitle === '') {
      return onDelete?.(todo.id);
    }

    onUpdate?.({ ...todo, title: trimmedTitle })
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          checked={todo.completed}
          onChange={() =>
            onUpdate?.({ ...todo, completed: !todo.completed }).catch(() => {})
          }
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            onBlur={handleSave}
            ref={inputRef}
            onKeyUp={handleKeyUp}
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
