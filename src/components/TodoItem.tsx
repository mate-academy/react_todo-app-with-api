/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (todo: Todo) => void;
  onRename?: (todo: Todo, newTitle: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  isLoading,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  const handleDeleteClick = () => {
    if (!onDelete || isLoading || isTemp) {
      return;
    }

    onDelete(todo.id);
  };

  const handleStatusChange = () => {
    if (isLoading || isTemp || !onToggle) {
      return;
    }

    onToggle(todo);
  };

  const handleTitleDoubleClick = () => {
    if (isLoading || isTemp) {
      return;
    }

    setIsEditing(true);
    setTitle(todo.title);
  };

  const finishEditing = async () => {
    if (!onRename) {
      setIsEditing(false);

      return;
    }

    const trimmed = title.trim();

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    const success = await onRename(todo, trimmed);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTitle(todo.title);

      return;
    }

    if (event.key === 'Enter') {
      await finishEditing();
    }
  };

  const handleBlur = async () => {
    if (!isEditing) {
      return;
    }

    await finishEditing();
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
          onChange={handleStatusChange}
          disabled={isLoading || isTemp}
        />
      </label>

      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleTitleDoubleClick}
        >
          {todo.title}
        </span>
      ) : (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          autoFocus
        />
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDeleteClick}
          disabled={isLoading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || isTemp,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
