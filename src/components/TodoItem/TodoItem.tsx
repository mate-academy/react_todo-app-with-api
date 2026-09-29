/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (todoId: number) => void;
  onToggle?: (todo: Todo) => void;
  onRename?: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleCancel = () => {
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setNewTitle(todo.title);
    setIsEditing(true);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === '') {
      onDelete?.(todo.id);

      return;
    }

    if (trimmedNewTitle === todo.title) {
      handleCancel();

      return;
    }

    if (!onRename) {
      return;
    }

    onRename(todo.id, trimmedNewTitle)
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {});

    return;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo)}
        />
      </label>

      {!isEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEdit}
        >
          {todo.title}
        </span>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            className="todo__title-field"
            ref={inputRef}
            data-cy="TodoTitleField"
            value={newTitle}
            onChange={event => {
              setNewTitle(event.target.value);
            }}
            onBlur={handleSave}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                handleCancel();
              }
            }}
          />
        </form>
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
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
