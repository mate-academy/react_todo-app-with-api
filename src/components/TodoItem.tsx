/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  loading: boolean;
  isActive: number | null;
  setIsActive: (id: number | null) => void;
  onDelete: (id: number) => void;
  onToggle: (updatedTodo: Todo) => void;
  handleEditTodoTitle: (id: number, title: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  loading,
  isActive,
  setIsActive,
  onDelete,
  onToggle,
  handleEditTodoTitle,
}) => {
  const [editTitle, setEditTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStatusChange = () => {
    onToggle({ id, title, completed: !completed });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsActive(null);
    }
  };

  //#region Title Submit
  const handleBlur = () => {
    if (editTitle.trim() === '') {
      onDelete(id);

      return;
    }

    if (title === editTitle) {
      setIsActive(null);

      return;
    }

    handleEditTodoTitle(id, editTitle.trim());
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    handleBlur();
  };
  //#endregion

  const handleDoubleClick = () => {
    setIsActive(id);
    setEditTitle(title);
  };

  useEffect(() => {
    if (isActive === id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive, id]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
          disabled={loading}
        />
      </label>

      {id === isActive ? (
        <form onSubmit={handleEditSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            disabled={loading}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
            disabled={loading}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
