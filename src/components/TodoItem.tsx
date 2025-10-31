import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  isPending: boolean;
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number, completed: boolean) => void;
  onRename: (id: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  isPending,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const editField = useRef<HTMLInputElement>(null);

  const isTemp = todo.id === 0;

  useEffect(() => {
    if (isEditing && editField.current) {
      editField.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    if (isTemp) {
      return;
    }

    onToggle(todo.id, !todo.completed);
  };

  const handleEdit = () => {
    if (!isLoading) {
      setIsEditing(true);
      setEditedTitle(todo.title);
    }
  };

  const handleSubmit = async () => {
    const newTitle = editedTitle.trim();

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      try {
        await onDelete(todo.id);
      } catch {}

      return;
    }

    try {
      await onRename(todo.id, newTitle);
      setIsEditing(false);
    } catch {}
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isPending || isLoading}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          ref={editField}
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyUp={handleKeyUp}
          placeholder="Empty todo will be deleted"
          disabled={isLoading}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {todo.title}
          </span>

          {!isTemp && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
              disabled={isLoading}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTemp || isPending,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
