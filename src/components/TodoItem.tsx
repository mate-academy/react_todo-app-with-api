/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onRename: (todoId: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  isUpdating,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const editFieldRef = useRef<HTMLInputElement>(null);
  const wasLoadingRef = useRef(false);

  const isLoading = isDeleting || isUpdating;

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (
      wasLoadingRef.current &&
      !isLoading &&
      todo.title === editedTitle.trim()
    ) {
      setIsEditing(false);
    }

    wasLoadingRef.current = isLoading;
  }, [isLoading, todo.title, editedTitle]);

  const handleStartEditing = () => {
    setEditedTitle(todo.title);
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleFinishEditing = (value: string) => {
    const trimmedTitle = value.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    onRename(todo.id, trimmedTitle);
  };

  const handleTitleFieldKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleFinishEditing(event.currentTarget.value);
    }
  };

  const handleTitleFieldKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleTitleFieldBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleFinishEditing(event.currentTarget.value);
  };

  const handleDeleteClick = () => {
    onDelete(todo.id);
  };

  const handleToggleChange = () => {
    onToggle(todo);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleChange}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            ref={editFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleFieldBlur}
            onKeyDown={handleTitleFieldKeyDown}
            onKeyUp={handleTitleFieldKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteClick}
            disabled={isDeleting}
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
