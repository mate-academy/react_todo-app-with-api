import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isDeleting?: boolean;
  isAdding?: boolean;
  isToggling?: boolean;
  isUpdating?: boolean;
  onDelete: (id: number) => void;
  onToggleCompleted: (id: number, completed: boolean) => void;
  onUpdateTitle: (id: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  isToggling,
  isAdding,
  isUpdating,
  onDelete,
  onToggleCompleted,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = isDeleting || isAdding || isToggling || isUpdating;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = async () => {
    if (title === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await onUpdateTitle(todo.id, title);
      setIsEditing(false);
    } catch {
      // Keep the form open on error so user can try again
    }
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleToggle = () => {
    onToggleCompleted(todo.id, !todo.completed);
  };

  const handleDoubleClick = () => {
    if (!isLoading) {
      setIsEditing(true);
      setTitle(todo.title);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleBlur = async () => {
    if (!isEditing) {
      return;
    }

    await handleSubmit();
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await handleSubmit();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form
          className="todo__form"
          onSubmit={async event => {
            event.preventDefault();
            event.stopPropagation();
            await handleSubmit();
          }}
        >
          <input
            ref={inputRef}
            className="todo__title-field"
            value={title}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            data-cy="TodoTitleField"
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
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

      {/* Show loader only when action is in progress */}
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
