/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editField.current) {
      editField.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (isLoading) {
      return;
    }

    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!normalizedTitle) {
      onDelete?.(todo.id);

      return;
    }

    onUpdate?.(todo.id, { title: normalizedTitle })
      ?.then(() => {
        setIsEditing(false);
      })
      ?.catch(() => {
        editField.current?.focus();
      });
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate?.(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editField}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete?.(todo.id)}
        >
          ×
        </button>
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
