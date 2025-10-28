import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import type { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isPending: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number, nextCompleted: boolean) => Promise<void> | void;
  onRename: (id: number, newTitle: string) => Promise<void> | void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isPending,
  onDelete,
  onToggle,
  onRename,
}) => {
  const isTemp = todo.id === 0;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);
  const escCancelRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setDraft(todo.title);
  }, [todo.title]);

  const finishEdit = async () => {
    if (savingRef.current) {
      return;
    }

    savingRef.current = true;

    const trimmed = draft.trim();

    if (trimmed === todo.title) {
      setIsEditing(false);
      savingRef.current = false;

      return;
    }

    if (trimmed.length === 0) {
      await onDelete(todo.id);
      savingRef.current = false;

      return;
    }

    try {
      await onRename(todo.id, trimmed);
      setIsEditing(false);
    } catch {
      inputRef.current?.focus();
    } finally {
      savingRef.current = false;
    }
  };

  const cancelEdit = () => {
    setDraft(todo.title);
    setIsEditing(false);
    savingRef.current = false;
    escCancelRef.current = false;
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo item-enter-done', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label
        className={cn('todo__status-label', { disabled: isPending || isTemp })}
        aria-label="Toggle todo status"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
          disabled={isPending || isTemp}
        />
      </label>

      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            if (!isPending && !isTemp) {
              setIsEditing(true);
            }
          }}
        >
          {todo.title}
        </span>
      ) : (
        <form
          className={cn('todo__title', {
            editing: isEditing,
            disabled: isPending,
          })}
          onSubmit={e => {
            e.preventDefault();
            void finishEdit();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            className={cn('todo__title-field', {
              'todo__title-field--editing': isEditing,
            })}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={() => {
              if (escCancelRef.current) {
                escCancelRef.current = false;

                return;
              }

              void finishEdit();
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                escCancelRef.current = true;
                cancelEdit();
              }

              if (e.key === 'Enter') {
                e.preventDefault();
                void finishEdit();
              }
            }}
            disabled={isPending}
          />
        </form>
      )}

      {!isTemp && !isEditing && (
        <button
          type="button"
          className={cn('todo__remove', { disabled: isPending })}
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isPending}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isTemp || isPending })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
