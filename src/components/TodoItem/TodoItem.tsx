/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import type { Todo } from '../../types/todo';

type Props = {
  todo: Todo;
  isProcessed?: boolean;
  onDelete?: (id: number) => Promise<void>;
  onToggle?: (todo: Todo) => Promise<void>;
  onRename?: (todo: Todo, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed = false,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    if (isProcessed) {
      return;
    }

    setNewTitle(todo.title);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (savingRef.current) {
      return;
    }

    setIsEditing(false);
    setNewTitle(todo.title);
  };

  const saveChanges = async () => {
    if (!isEditing || savingRef.current) {
      return;
    }

    savingRef.current = true;

    const trimmedTitle = newTitle.trim();

    try {
      if (!trimmedTitle) {
        await onDelete?.(todo.id);
      } else if (trimmedTitle !== todo.title) {
        await onRename?.(todo, trimmedTitle);
      }

      setIsEditing(false);
    } catch {
      setIsEditing(true);
      editRef.current?.focus();
    } finally {
      savingRef.current = false;
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEditing();
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
          disabled={isProcessed}
          onChange={() => {
            void onToggle?.(todo);
          }}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            void saveChanges();
          }}
        >
          <input
            ref={editRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={() => {
              void saveChanges();
            }}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isProcessed}
            onClick={() => {
              void onDelete?.(todo.id).catch(() => {});
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background" />
        <div className="loader" />
      </div>
    </div>
  );
};
