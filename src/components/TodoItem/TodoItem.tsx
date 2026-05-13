import cn from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  isProcessing: boolean;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onRename: (todo: Todo, title: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessing,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const wasRenamed = await onRename(todo, editedTitle);

    if (wasRenamed) {
      setIsEditing(false);
    }
  };

  const handleBlur = async () => {
    const wasRenamed = await onRename(todo, editedTitle);

    if (wasRenamed) {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isProcessing}
          onChange={() => onToggle(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleBlur}
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
            data-cy="TodoDelete"
            className="todo__remove"
            disabled={isProcessing}
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
