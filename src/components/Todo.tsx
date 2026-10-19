import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, data: Partial<Todo>) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleToggleStatus = () => {
    if (onUpdate) {
      onUpdate(todo.id, { completed: !todo.completed });
    }
  };

  const handleDoubleClick = () => {
    setNewTitle(todo.title);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const trimmedTitle = newTitle.trim();

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
      try {
        await onUpdate(todo.id, { title: trimmedTitle });
        setIsEditing(false);
      } catch {
        // Залишаємо інпут відкритим при помилці
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleCancelEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${todo.id}`}
        aria-label="Todo status"
      >
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleStatus}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={titleInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={() => handleSubmit()}
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
            onClick={() => onDelete?.(todo.id)}
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

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
};
