/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  isDeleting: boolean;
  onToggle: (todo: Todo) => Promise<void>;
  onRename: (todo: Todo, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isDeleting,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const editInputRef = useRef<HTMLInputElement>(null);

  const isTemp = todo.id === 0;
  const shouldShowLoader = isDeleting || isTemp || isUpdating;

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const startEdit = () => {
    setIsEditing(true);
    setEditedTitle(todo.title);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(todo.title);
  };

  const saveEdit = async () => {
    const trimmed = editedTitle.trim();

    if (trimmed === todo.title) {
      cancelEdit();

      return;
    }

    setIsUpdating(true);

    try {
      if (!trimmed) {
        await onDelete(todo.id);
      } else {
        await onRename(todo, trimmed);
      }

      cancelEdit();
    } catch {
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggle = async () => {
    if (isTemp) {
      return;
    }

    setIsUpdating(true);
    try {
      await onToggle({ ...todo, completed: !todo.completed });
    } finally {
      setIsUpdating(false);
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
          onChange={handleToggle}
          disabled={shouldShowLoader}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            saveEdit();
          }}
        >
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={() => {
              if (!isUpdating) {
                saveEdit();
              }
            }}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                cancelEdit();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEdit}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => !isTemp && onDelete(todo.id)}
            disabled={shouldShowLoader}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': shouldShowLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
