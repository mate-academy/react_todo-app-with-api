import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onUpdate?: (id: number, data: Partial<Todo>) => Promise<boolean>;
  deletedTodos: number[];
  updatingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  deletedTodos,
  onUpdate,
  updatingIds,
}) => {
  const { id, completed, title } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const editInputField = useRef<HTMLInputElement>(null);

  const isLoading = deletedTodos.includes(id) || updatingIds.includes(id);

  useEffect(() => {
    if (isEditing && editInputField.current) {
      editInputField.current.focus();
    }
  }, [isEditing, editInputField]);

  const handleDelete = async () => {
    await onDelete(id);
  };

  const handleStatusToggle = async () => {
    if (onUpdate) {
      await onUpdate(id, { completed: !completed });
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  const handleEditSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (editTitle.trim() === title) {
      setIsEditing(false);

      return;
    }

    if (!editTitle.trim()) {
      await handleDelete();

      return;
    }

    try {
      if (onUpdate) {
        const success = await onUpdate(id, { title: editTitle.trim() });

        if (success) {
          setIsEditing(false);
        } else {
          setTimeout(() => {
            editInputField.current?.focus();
          }, 0);
        }
      }
    } catch {
      // Error is handled in onUpdate
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusToggle}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={() => {
              handleEditSubmit();
            }}
            onKeyUp={handleKeyUp}
            ref={editInputField}
            disabled={isLoading}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
            disabled={isLoading}
          >
            ×
          </button>
        </>
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
