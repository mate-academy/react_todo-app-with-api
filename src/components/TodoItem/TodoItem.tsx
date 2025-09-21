/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo & { loading?: boolean };
  toggleTodo: (id: number) => void;
  handleDelete: (id: number) => void;
  handleUpdate: (id: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodo,
  handleDelete,
  handleUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(false);

  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditingRef.current) {
      setEditTitle(todo.title);
    }
  }, [todo.title]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newTitle = editTitle.trim();

      if (!newTitle) {
        handleDelete(todo.id);

        return;
      }

      if (newTitle !== todo.title) {
        handleUpdate(todo.id, newTitle)
          .then(() => {
            setIsEditing(false);
          })
          .catch(() => {
            setIsEditing(true);
          });
      } else {
        setIsEditing(false);
      }
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  const handleBlur = () => {
    const newTitle = editTitle.trim();

    if (!newTitle) {
      handleDelete(todo.id);
      setIsEditing(false);

      return;
    }

    if (newTitle !== todo.title) {
      handleUpdate(todo.id, newTitle)
        .then(() => setIsEditing(false))
        .catch(() => {});
    } else {
      setIsEditing(false);
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
          onChange={() => toggleTodo(todo.id)}
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus={true}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className={classNames('todo__title', { hidden: isEditing })}
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
          disabled={todo.loading}
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': todo.loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
