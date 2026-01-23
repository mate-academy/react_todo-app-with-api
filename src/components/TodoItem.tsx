/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (v: number) => void;
  isLoading: boolean;
  onToggle: (v: Todo) => void;
  onRename: (id: number, newTitle: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleBlur = async () => {
    const success = await onRename(todo.id, editTitle);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const success = await onRename(todo.id, editTitle);

      if (success) {
        setIsEditing(false);
      }
    }

    if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          ref={inputRef}
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          className="todo__title-field"
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
