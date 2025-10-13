/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable padding-line-between-statements */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      await onUpdate(todo.id, { completed: !todo.completed });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    const trimmed = newTitle.trim();
    if (trimmed === todo.title) {
      setIsEditing(false);
      return;
    }

    if (!trimmed) {
      await onDelete(todo.id);
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(todo.id, { title: trimmed });
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="todo__status"
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleEdit();
          }}
        >
          <input
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleEdit}
            onKeyUp={e => e.key === 'Escape' && setIsEditing(false)}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      {isLoading && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
