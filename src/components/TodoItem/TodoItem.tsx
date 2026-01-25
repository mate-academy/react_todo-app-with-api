import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo & { isDeleting?: boolean; isUpdating?: boolean };
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onRename: (id: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  onRename,
}) => {
  const isTemp = todo.id === 0;
  const isLoading = isTemp || todo.isDeleting || todo.isUpdating;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  function handleSubmit() {
    const title = editedTitle.trim();

    if (!title) {
      onDelete(todo.id);

      return;
    }

    if (title !== todo.title) {
      onRename(todo.id, title)
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {});
    } else {
      setIsEditing(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSubmit();
    }

    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      {!isEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => !isLoading && setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {isEditing && (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editedTitle}
          disabled={isLoading}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
          disabled={isLoading}
        >
          ×
        </button>
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
