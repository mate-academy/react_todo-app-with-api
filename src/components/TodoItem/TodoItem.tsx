/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onToggle: (todoId: number) => void;
  onUpdate: (todoId: number, updatedFields: Partial<Todo>) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = async () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === '') {
      onDelete(todo.id);

      return;
    }

    if (trimmedTitle !== todo.title) {
      try {
        await onUpdate(todo.id, { title: trimmedTitle });
        setIsEditing(false);
      } catch {}
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }

    if (event.key === 'Enter') {
      void handleBlur();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        'todo--loading': todo.isDeleting || todo.isLoading,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={todo.isLoading || todo.isDeleting}
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          autoFocus
          data-cy="TodoTitleField"
          className="todo__title-input"
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEdit}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          aria-label="Delete todo"
          onClick={() => onDelete(todo.id)}
          disabled={todo.isLoading || todo.isDeleting}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todo.isDeleting || todo.isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
