import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

export type Props = {
  todo: Todo;
  loading: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  onUpdate?: (newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { title, completed, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const saveChanges = () => {
    if (!onUpdate || !onDelete) {
      return;
    }

    const trimValue = value.trim();

    if (!trimValue) {
      onDelete();

      return;
    }

    if (trimValue !== title) {
      onUpdate(trimValue);
    }

    setIsEditing(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveChanges();
  };

  const handleBlur = () => {
    saveChanges();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setValue(title);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    setIsEditing(true);
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onToggle}
        />
      </label>
      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
        </form>
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
