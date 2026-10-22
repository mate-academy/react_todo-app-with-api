import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoChanges } from '../api/todos';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (todoId: number) => Promise<boolean>;
  onUpdate: (todoId: number, changes: TodoChanges) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const { id, title, completed } = todo;
  const statusInputId = `todo-status-${id}`;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isEditing, isLoading]);

  const startEditing = () => {
    if (isLoading) {
      return;
    }

    setEditedTitle(title);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (isLoading) {
      return;
    }

    setIsEditing(false);
    setEditedTitle(title);
  };

  const saveTitle = async () => {
    if (!isEditing || isLoading) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === title) {
      cancelEditing();

      return;
    }

    const success = trimmedTitle
      ? await onUpdate(id, { title: trimmedTitle })
      : await onDelete(id);

    if (success) {
      setIsEditing(false);
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label" htmlFor={statusInputId}>
        <input
          id={statusInputId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Mark todo as completed"
          checked={completed}
          disabled={isLoading}
          onChange={() => {
            void onUpdate(id, { completed: !completed });
          }}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            void saveTitle();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            aria-label="Edit todo title"
            value={editedTitle}
            readOnly={isLoading}
            onChange={event => {
              setEditedTitle(event.target.value);
            }}
            onBlur={() => {
              void saveTitle();
            }}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                cancelEditing();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            aria-label="Delete todo"
            disabled={isLoading}
            onClick={() => {
              void onDelete(id);
            }}
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
