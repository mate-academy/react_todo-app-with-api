import React, { useState, useRef, useEffect } from 'react';
import { Todo } from './types/Todo';
import classNames from 'classnames';
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  todo: Todo;
  onDelete: (todoId: number, errorMessage?: string) => Promise<boolean>;
  onStatusChange: (todo: Todo) => void;
  onRename: (todo: Todo, newTitle: string) => Promise<boolean>;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onStatusChange,
  onRename,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editFieldRef.current) {
      editFieldRef.current.focus();
    }
  }, [isEditing]);

  const handleStatusChange = () => {
    onStatusChange(todo);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setNewTitle(todo.title);
  };

  const handleSave = async () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      try {
        const isSuccessful = await onDelete(todo.id);

        if (isSuccessful) {
          setIsEditing(false);
        }
      } catch (error) {}

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      const isSuccessful = await onRename(todo, trimmedTitle);

      if (isSuccessful) {
        setIsEditing(false);
      }
    } catch (error) {}
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>
      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          ref={editFieldRef}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
