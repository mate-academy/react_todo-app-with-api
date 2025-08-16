import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
  onUpdate?: (id: number, data: Partial<Todo>) => Promise<boolean>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!isLoading) {
      setIsEditing(true);
      setEditTitle(todo.title);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === '') {
      if (onDelete) {
        onDelete(todo.id);
      }

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (onUpdate) {
      const success = await onUpdate(todo.id, { title: trimmedTitle });

      if (success) {
        setIsEditing(false);
      }
    }
  };

  const handleEditBlur = async () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === '') {
      if (onDelete) {
        onDelete(todo.id);
      }

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (onUpdate) {
      const success = await onUpdate(todo.id, { title: trimmedTitle });

      if (success) {
        setIsEditing(false);
      }
    }
  };

  const handleEditKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo${todo.completed ? ' completed' : ''}${isEditing ? ' editing' : ''}`}
      aria-busy={isLoading}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            if (onToggle) {
              onToggle(todo.id);
            }
          }}
          aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleEditBlur}
            onKeyUp={handleEditKeyUp}
            ref={editInputRef}
            aria-label="Edit todo title"
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          aria-label="Delete todo"
          onClick={() => {
            if (onDelete) {
              onDelete(todo.id);
            }
          }}
          disabled={isLoading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay${isLoading ? ' is-active' : ''}`}
        aria-hidden={!isLoading}
        style={{ display: isLoading ? 'block' : 'none' }}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
