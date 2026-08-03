/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

import { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo, TodoChanges } from '../../types/Todo';

export type TodoItemProps = {
  todo: Todo;
  isLoading?: boolean;
  onRemove?: (todoId: number) => Promise<void> | void;
  onUpdate?: (todoId: number, changes: TodoChanges) => Promise<void> | void;
};

const TodoItemComponent = ({
  todo,
  isLoading = false,
  onRemove,
  onUpdate,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  const startEditing = useCallback(() => {
    setEditedTitle(todo.title);
    setIsEditing(true);
  }, [todo.title]);

  const cancelEditing = useCallback(() => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  }, [todo.title]);

  const finishEditing = useCallback(() => {
    const title = editedTitle.trim();

    if (title === '') {
      Promise.resolve(onRemove?.(todo.id)).then(() => {
        setIsEditing(false);
      });

      return;
    }

    if (title === todo.title) {
      cancelEditing();

      return;
    }

    Promise.resolve(
      onUpdate?.(todo.id, {
        title,
      }),
    )?.then(() => {
      setIsEditing(false);
    });
  }, [editedTitle, todo.id, todo.title, onRemove, onUpdate, cancelEditing]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    finishEditing();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', todo.completed && 'completed')}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading || isEditing}
          onChange={() =>
            onUpdate?.(todo.id, {
              completed: !todo.completed,
            })
          }
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={finishEditing}
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
            onClick={() => onRemove?.(todo.id)}
            disabled={isLoading}
          >
            x
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', isLoading && 'is-active')}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export const TodoItem = React.memo(TodoItemComponent);
