/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { Todo } from '../types/Todo';
import React, { useState } from 'react';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  onDelete?: (id: number) => void;
  onUpdate: (todo: Todo) => void;
  onUpdateTitle: (todo: Todo) => void;
  loading?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  onDelete,
  onUpdate,
  onUpdateTitle,
}) => {
  const { id, title: todoTitle, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setTitle(todoTitle);
  };

  const handleSave = async () => {
    const newData = { ...todo };

    newData.title = title.trim();

    if (!newData.title) {
      if (onDelete) {
        try {
          await onDelete(id);

          return;
        } catch (e) {
          setError('Unable to delete todo');

          return;
        }
      }
    }

    if (onUpdateTitle) {
      try {
        await onUpdateTitle(newData);
        setIsEditing(false);
      } catch (e) {
        setError('Unable to update title');
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setTitle(todoTitle);
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { 'completed' : completed,})}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate({ ...todo, title })}
          disabled={loading}
        />
      </label>

      {isEditing ? (
        <>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={loading}
          />
          {error && <div className="error-message">{error}</div>}
        </>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEdit}
        >
          {todoTitle}
        </span>
      )}

      {!isEditing && onDelete && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
          disabled={loading}
        >
          ×
        </button>
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
