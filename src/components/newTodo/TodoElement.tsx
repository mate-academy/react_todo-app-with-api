import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void,
  isLoading: boolean;
  statusChange: (id: number, data: Partial<Todo>) => void,
};

export const TodoElement: React.FC<Props> = (
  {
    todo,
    isLoading,
    onDelete,
    statusChange,
  },
) => {
  const { title, completed, id } = todo;
  const [editedMode, setEditedMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [newTitle, setTitle] = useState(title);

  const handleCancel = () => {
    setEditedMode(false);
    setTitle(title);
  };

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
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
  }, [editedMode]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTitle) {
      onDelete(id);
    } else {
      statusChange(id, { title: newTitle });
      setEditedMode(false);
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => statusChange(id, { completed: !completed })}
        />
      </label>

      {editedMode ? (
        <form onSubmit={handleSubmitForm}>
          <input
            className="todo__title-field"
            type="text"
            value={newTitle}
            onChange={handleInputChange}
            onBlur={handleCancel}
            ref={inputRef}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={() => setEditedMode(true)}
        >
          {title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!editedMode && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => onDelete(id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
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
