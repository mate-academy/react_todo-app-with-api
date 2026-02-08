import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: () => void;
  onToggle?: () => void;
  onRename?: (title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onRename = () => Promise.resolve(),
}) => {
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTodoEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTodoEditing]);

  const handleSubmit = (event?: React.FormEvent) => {
    const trimmedTodo = newTitle.trim();

    if (event) {
      event.preventDefault();
    }

    if (!isTodoEditing) {
      return;
    }

    if (!trimmedTodo) {
      onDelete?.();

      return;
    }

    if (trimmedTodo === todo.title) {
      setIsTodoEditing(false);

      return;
    }

    onRename(trimmedTodo)
      .then(() => {
        setIsTodoEditing(false);
      })
      .catch(() => {
        inputRef.current?.focus();
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsTodoEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={onToggle}
          aria-label="Mark todo as completed"
        />
      </label>

      {!isTodoEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsTodoEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={newTitle}
            disabled={isLoading}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={() => {
              if (!isLoading) {
                handleSubmit();
              }
            }}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
