import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  isDeleting: boolean;
  isUpdating?: boolean;
  onDelete: (id: number) => void;
  onUpdate: (id: number, completed: boolean) => void;
  onTitleUpdate: (id: number, title: string) => void;
}

const modalBackgroundClass = 'modal-background has-background-white-ter';

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isDeleting,
  isUpdating = false,
  onDelete,
  onUpdate,
  onTitleUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isUpdating && isSubmitting) {
      if (todo.title === editTitle.trim()) {
        setIsEditing(false);
      }

      setIsSubmitting(false);
    }
  }, [isUpdating, isSubmitting, todo.title, editTitle]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleSubmit = async () => {
    const newTitle = editTitle.trim();

    if (!newTitle) {
      onDelete(todo.id);

      return;
    }

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    setIsSubmitting(true);

    onTitleUpdate(todo.id, newTitle);
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          ref={editInputRef}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting || isUpdating ? 'is-active' : ''}`}
      >
        <div className={modalBackgroundClass} />
        <div className="loader" />
      </div>
    </div>
  );
};
