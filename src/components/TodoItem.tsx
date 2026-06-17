/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editField.current?.focus();
    }
  }, [isEditing]);

  const saveTitle = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    onUpdate({ ...todo, title: trimmedTitle })
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        setIsEditing(true);
        editField.current?.focus();
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTitle();
  };

  const handleBlur = () => {
    saveTitle();
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          className="todo__status"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onUpdate({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            ref={editField}
            className="todo__input"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            data-cy="TodoTitle"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="loader" />
      </div>
    </div>
  );
};
