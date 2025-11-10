/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todoId: number) => void;
  onToggle?: (todoId: number, completed: boolean) => void;
  onUpdate?: (todoId: number, title: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(todo.title);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(todo.id);
    }
  };

  const handleToggle = () => {
    if (onToggle) {
      onToggle(todo.id, !todo.completed);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const saveEdit = () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      if (onDelete) {
        onDelete(todo.id);
      }

      return;
    }

    if (onUpdate) {
      onUpdate(todo.id, trimmedTitle)
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {});
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveEdit();
  };

  const handleBlur = () => {
    saveEdit();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    if (isEditing) {
      const input = document.querySelector<HTMLInputElement>(
        `[data-cy="TodoTitleField"][data-id="${todo.id}"]`,
      );

      input?.focus();
    }
  }, [isEditing, todo.id]);

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
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            data-id={todo.id}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
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
