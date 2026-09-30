import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo, TodoUpdate } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todoId: number) => Promise<boolean>;
  onUpdate?: (todoId: number, changes: TodoUpdate) => Promise<boolean>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(false);
  const isSaving = useRef(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const cancelEditing = () => {
    isEditingRef.current = false;
    setIsEditing(false);
  };

  const startEditing = () => {
    if (isLoading || !onUpdate) {
      return;
    }

    setTitle(todo.title);
    isEditingRef.current = true;
    setIsEditing(true);
  };

  const saveTitle = async () => {
    if (!isEditingRef.current || isSaving.current || isLoading) {
      return;
    }

    const newTitle = title.trim();

    if (newTitle === todo.title) {
      cancelEditing();

      return;
    }

    isSaving.current = true;

    try {
      const wasSaved = newTitle
        ? await onUpdate?.(todo.id, { title: newTitle })
        : await onDelete?.(todo.id);

      if (wasSaved) {
        cancelEditing();
      } else {
        inputRef.current?.focus();
      }
    } finally {
      isSaving.current = false;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void saveTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && !isSaving.current && !isLoading) {
      cancelEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${todo.id}`}
        aria-label={`Status of ${todo.title}`}
      >
        <input
          data-cy="TodoStatus"
          id={`todo-status-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading || !onUpdate}
          onChange={() => {
            void onUpdate?.(todo.id, { completed: !todo.completed });
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            aria-label={`Edit ${todo.title}`}
            value={title}
            readOnly={isLoading}
            onChange={event => setTitle(event.target.value)}
            onBlur={() => {
              void saveTitle();
            }}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            role="button"
            tabIndex={0}
            aria-label={`Edit ${todo.title}`}
            aria-disabled={isLoading || !onUpdate}
            onDoubleClick={startEditing}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                startEditing();
              }
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            aria-label={`Delete ${todo.title}`}
            disabled={isLoading || !onDelete}
            onClick={() => {
              void onDelete?.(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
