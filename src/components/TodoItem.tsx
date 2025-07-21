import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../types';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  isDeleting?: boolean;
  togglingTodoIds?: number[];
  onDelete?: (id: number) => void;
  onToggle?: (todo: Todo) => void;
  onRename?: (id: number, newTitle: string) => void;
  renamingTodoIds?: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp = false,
  isDeleting = false,
  togglingTodoIds = [],
  onDelete,
  onToggle,
  onRename,
  renamingTodoIds = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  const inputRef = useRef<HTMLInputElement>(null);
  const isToggling = togglingTodoIds.includes(todo.id);
  const isRenaming = renamingTodoIds?.includes(todo.id) ?? false;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSubmit = async () => {
    const trimmed = title.trim();

    if (!trimmed) {
      const success = await onRename?.(todo.id, trimmed);

      if (success) {
        setIsEditing(false);
      }

      return;
    }

    if (trimmed !== todo.title) {
      const success = await onRename?.(todo.id, trimmed);

      if (success) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleSubmit();
    }

    if (e.key === 'Escape') {
      setTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${
        isDeleting ? 'is-deleting' : ''
      } ${isEditing ? 'editing' : ''}`}
    >
      <label
        className="todo__status-label"
        aria-label={
          todo.completed
            ? 'Mark todo as not completed'
            : 'Mark todo as completed'
        }
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo)}
          disabled={isTemp || isDeleting || isToggling}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          disabled={isDeleting}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && !isTemp && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isDeleting}
          onClick={() => onDelete?.(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`todo__loader ${
          isTemp || isDeleting || isToggling || isRenaming ? 'is-active' : ''
        }`}
      >
        <div className="loader" />
      </div>
    </div>
  );
};
