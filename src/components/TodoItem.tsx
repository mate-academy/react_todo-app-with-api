import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onEdit: (
    id: number,
    newTitle: string,
  ) => Promise<'updated' | 'deleted' | 'error'>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggleComplete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [localLoading, setLocalLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!todo.loading) {
      setEditTitle(todo.title);
      setIsEditing(true);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const finishEdit = async (action: 'submit' | 'blur' | 'esc') => {
    if (isSubmittingRef.current) {
      return;
    }

    if (action === 'esc') {
      setIsEditing(false);
      setEditTitle(todo.title);

      return;
    }

    const trimmed = editTitle.trim();

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    isSubmittingRef.current = true;
    setLocalLoading(true);

    try {
      const result = await onEdit(todo.id, trimmed);

      if (result === 'updated' || result === 'deleted') {
        setIsEditing(false);
      }

      if (result === 'error') {
        setIsEditing(true);
        inputRef.current?.focus();
      }
    } finally {
      setLocalLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      finishEdit('esc');
    }
  };

  const handleEditBlur = () => {
    if (localLoading) {
      return;
    }

    finishEdit('blur');
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
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          aria-label="Toggle todo status"
        />
      </label>

      {isEditing ? (
        <form
          className="todo__edit-form"
          onSubmit={e => {
            e.preventDefault();
            finishEdit('submit');
          }}
        >
          <input
            ref={inputRef}
            className="todo__edit-input"
            value={editTitle}
            onChange={handleEditChange}
            onBlur={handleEditBlur}
            onKeyDown={handleEditKeyDown}
            disabled={localLoading}
            data-cy="TodoTitleField"
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
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
          aria-label="Delete todo"
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todo.loading || localLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
