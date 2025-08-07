import React, { useState } from 'react';
import { TodoItemProps } from './types/TodoItemProps';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  loadingTodo,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const cancelEditing = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  const finishEditing = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      onDelete(todo.id);

      return;
    }

    if (trimmedTitle !== todo.title) {
      const response = await onRename(todo.id, trimmedTitle);

      if (response) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEditing();
    }

    if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => onToggle(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={handleKeyDown}
          autoFocus
        />
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
          onClick={() => onDelete(todo.id)}
          disabled={isLoading}
        >
          {loadingTodo === todo.id ? <span className="loader is-small" /> : '×'}
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay ', {
          'is-active': loadingTodo === todo.id || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
