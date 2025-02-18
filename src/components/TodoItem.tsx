/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { USER_ID } from '../api/todos';

interface TodoItemProps {
  todo: Todo;
  loading: boolean;
  isActiveTodo: number | null;
  setIsActiveTodo: (id: number | null) => void;
  onDelete: (id: number) => void;
  onToggle: (updatedTodo: Todo) => void;
  handleEditTitle: (id: number, title: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  loading,
  isActiveTodo,
  setIsActiveTodo,
  onDelete,
  onToggle,
  handleEditTitle,
}) => {
  const [editTitle, setEditTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStatusChange = () =>
    onToggle({ id, title, completed: !completed, userId: USER_ID });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEditTitle(event.target.value);

  const handleKeyUp = (event: React.KeyboardEvent) =>
    event.key === 'Escape' && setIsActiveTodo(null);

  const handleBlur = () => {
    if (editTitle.trim() === '') {
      onDelete(id);

      return;
    }

    if (title === editTitle) {
      setIsActiveTodo(null);

      return;
    }

    handleEditTitle(id, editTitle.trim());
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleBlur();
  };

  const handleDoubleClick = () => {
    setIsActiveTodo(id);
    setEditTitle(title);
  };

  useEffect(() => {
    if (isActiveTodo === id && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isActiveTodo, id]);

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

      {id === isActiveTodo ? (
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
