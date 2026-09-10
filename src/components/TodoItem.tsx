/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (
    todoId: number,
    dataToUpdate: Partial<Omit<Todo, 'id' | 'userId'>>,
  ) => Promise<void>;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleToggleStatus = () => {
    onUpdate(todo.id, { completed: !todo.completed }).catch(() => {});
  };

  const handleStartEdit = () => {
    setNewTitle(todo.title);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const handleSaveTitle = () => {
    if (!isEditing) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    onUpdate(todo.id, { title: trimmedTitle })
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSaveTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancelEdit();
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
          onChange={handleToggleStatus}
        />
        <span className="todo__status-label-icon" />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartEdit}
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
        <div
          className={['modal-background', 'has-background-white-ter'].join(' ')}
        />
        <div className="loader" />
      </div>
    </div>
  );
};
