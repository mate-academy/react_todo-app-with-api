/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => Promise<void> | void;
  onUpdate: (todo: Todo) => Promise<void> | void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editFieldRef = useRef<HTMLInputElement>(null);
  const isEscaping = useRef(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (isEditing && editFieldRef.current) {
      editFieldRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setNewTitle(todo.title);
    setIsEditing(true);
  };

  const handleStatusChange = () => {
    onUpdate({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleTitleSubmit = async () => {
    if (isSubmittingRef.current) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      isSubmittingRef.current = true;
      try {
        await onDelete(todo.id);
        setIsEditing(false);
      } catch {
      } finally {
        isSubmittingRef.current = false;
      }

      return;
    }

    isSubmittingRef.current = true;
    try {
      await onUpdate({
        ...todo,
        title: trimmedTitle,
      });
      setIsEditing(false);
    } catch {
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      isEscaping.current = true;
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  const handleBlur = () => {
    if (isEscaping.current) {
      isEscaping.current = false;

      return;
    }

    handleTitleSubmit();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTitleSubmit();
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
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
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            ref={editFieldRef}
          />
        </form>
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
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
