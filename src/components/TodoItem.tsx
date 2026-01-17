/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void>;
  loadingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  loadingIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);
  const isLoading = loadingIds.includes(todo.id);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    try {
      await onUpdate(todo.id, { title: trimmedTitle });
      setIsEditing(false);
    } catch {
      editFieldRef.current?.focus();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={editFieldRef}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
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
