import React, { useEffect, useRef, useState } from 'react';
import type { Todo } from '../../types/Todo';
import cn from 'classnames';

/* eslint-disable react/jsx-filename-extension */

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: number) => void;
  toggleTodo: (todoId: number) => void;
  onUpdate?: (todoId: number, title: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  toggleTodo,
  onUpdate,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(id);

      return;
    }

    if (onUpdate) {
      onUpdate(id, trimmedTitle)
        .then(() => setIsEditing(false))
        .catch(() => {});
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
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
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          readOnly
        />
        <span className="is-hidden">Todo status</span>
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            ref={editInputRef}
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

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
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

export default TodoItem;
