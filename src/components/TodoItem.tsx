/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
// import { event } from 'cypress/types/jquery';

type Props = {
  todo: Todo;
  isProcessed?: boolean;
  isEditing?: boolean;
  onDelete?: () => void;
  onUpdate: (fieldsToUpdate: Partial<Todo>) => void;
  onEdit: (id: number | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  isEditing,
  onDelete,
  onUpdate,
  onEdit,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      onDelete?.();

      return;
    }

    if (trimmedTitle === todo.title) {
      onEdit(null);

      return;
    }

    onUpdate({ title: trimmedTitle });
  }

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate({ completed: !todo.completed })}
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
            onChange={event => setNewTitle(event.target.value)}
            ref={editInputRef}
            onBlur={handleSubmit}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                onEdit(null);
                setNewTitle(todo.title);
              }
            }}
          />
        </form>
      ) : (
        <>
          {' '}
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              onEdit(todo.id);
            }}
          >
            {todo.title}
          </span>
          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isProcessed ? 'is-active' : 'is-hidden'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
