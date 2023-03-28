import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading: boolean;
  onUpdateTodo: (id: number, data: Partial<Todo>) => void;
};

export const TodoElement: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onUpdateTodo,
}) => {
  const { title, completed, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(title);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      onDelete(id);
    } else {
      onUpdateTodo(id, { title: query });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setQuery(title);
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current !== null) {
      inputField.current.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing]);

  return (
    <div className={classNames(
      'todo',
      { completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdateTodo(id, { completed: !completed })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              className="todo__title-field"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={handleCancel}
              ref={inputField}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames(
        'modal overlay',
        {
          'is-active': isLoading,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
