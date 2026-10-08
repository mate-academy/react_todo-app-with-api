import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import type { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<boolean>;
  onToggle: (todoId: number) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
  onUpdate,
  onToggle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const titleFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      titleFieldRef.current?.focus();
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    setEditedTitle(todo.title);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (isProcessed) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      handleCancelEditing();

      return;
    }

    if (!trimmedTitle) {
      setEditedTitle('');
      await onDelete(todo.id);

      return;
    }

    const wasUpdated = await onUpdate(todo.id, { title: trimmedTitle });

    if (wasUpdated) {
      setIsEditing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void handleSave();
  };

  const handleBlur = () => {
    void handleSave();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancelEditing();
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={todo.completed}
          aria-label="Mark as completed"
          onChange={() => {
            void onToggle(todo.id);
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            ref={titleFieldRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            aria-label="Delete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
