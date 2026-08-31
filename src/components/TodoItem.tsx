/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  onToggle: (todoId: number) => void;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, newTitle: string) => void;
  isUpdating: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  onToggle,
  onDelete,
  onUpdate,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editField.current?.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    setEditTitle(todo.title);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const saveEdit = async () => {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      cancelEdit();

      return;
    }

    try {
      await onUpdate(todo.id, trimmedTitle);

      setIsEditing(false);
    } catch {}
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
          onChange={() => {
            onToggle(todo.id);
          }}
        />
      </label>

      {isEditing ? (
        <input
          ref={editField}
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onBlur={saveEdit}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              saveEdit();
            }

            if (event.key === 'Escape') {
              cancelEdit();
            }
          }}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={startEditing}
        >
          {todo.title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

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
