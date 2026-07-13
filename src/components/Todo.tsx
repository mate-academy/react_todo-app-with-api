/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo as TodoType } from '../types/Todo';

interface Props {
  todo: TodoType;
  isDeleting: boolean;
  isUpdating: boolean;
  isEditing: boolean;
  onToggle: (todo: TodoType) => void;
  onDelete: (id: number) => void;
  onRename: (todo: TodoType, newTitle: string) => void;
  onStartEdit: (todo: TodoType) => void;
  onCancelEdit: () => void;
}

export const Todo: React.FC<Props> = ({
  todo,
  isDeleting,
  isUpdating,
  isEditing,
  onToggle,
  onDelete,
  onRename,
  onStartEdit,
  onCancelEdit,
}) => {
  const [editTitle, setEditTitle] = useState(todo.title);
  const isCancelled = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      setEditTitle(todo.title);
      isCancelled.current = false;
      inputRef.current?.focus();
    }
  }, [isEditing, todo.title]);

  const handleSave = () => {
    if (isCancelled.current) {
      return;
    }

    onRename(todo, editTitle);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      isCancelled.current = true;
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onCancelEdit();
    }
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
          onChange={() => onToggle(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onStartEdit(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeleting || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
