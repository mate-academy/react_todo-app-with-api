import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

export const TodoItem: React.FC<{
  todo: Todo;
  onDelete?: () => void;
  onToggle?: () => void;
  onRename?: (title: string) => Promise<void>;
  isProcessing?: boolean;
}> = ({ todo, onDelete, onToggle, onRename, isProcessing }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isError, setIsError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const cancelEdit = () => {
    setIsEditing(false);
    setNewTitle(todo.title);
    setIsError(false);
  };

  const finishEdit = () => {
    const trimmed = newTitle.trim();

    if (!trimmed) {
      onDelete?.();

      return;
    }

    if (trimmed !== todo.title && onRename) {
      onRename(trimmed)
        .then(() => {
          setIsEditing(false);
          setIsError(false);
        })
        .catch(() => setIsError(true));
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEdit();
    }

    if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
          disabled={isProcessing}
        />
        <span className="todo__status-custom" aria-hidden="true" />
      </label>

      {!isEditing ? (
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
            onClick={onDelete}
            disabled={isProcessing}
          >
            ×
          </button>
        </>
      ) : (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          className={classNames('todo__title-field', {
            'is-error': isError,
          })}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onBlur={finishEdit}
          onKeyUp={handleKeyUp}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
