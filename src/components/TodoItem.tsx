import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessing: boolean;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: { title?: string; completed?: boolean }) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessing,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleSave = async (e: React.FormEvent | React.FocusEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();

    if (trimmed === '') {
      onDelete(todo.id);

      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await onUpdate(todo.id, { title: trimmed });
      setIsEditing(false); // Close only if successful
    } catch {
      // Stay in edit mode on fail
    }
  };

  function handleKeyUp(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);

      return;
    }
  }

  const inputEditRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputEditRef.current) {
      inputEditRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
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
        <form onSubmit={handleSave}>
          <input
            ref={inputEditRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSave}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={e => {
            e.stopPropagation();
            if (!isProcessing) {
              setIsEditing(true);
            }
          }}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          data-cy="TodoDelete"
          type="button"
          className="todo__remove"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('overlay modal', { 'is-active': isProcessing })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
