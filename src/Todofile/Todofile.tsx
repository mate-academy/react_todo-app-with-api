/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo | null;
  onSelect: (todoId: number) => void;
  updated: (todo: Todo) => Promise<void>;
  isLoading?: boolean;
}

export const Todofile: React.FC<Props> = ({
  todo = null,
  onSelect,
  updated,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo?.title || '');

  if (!todo) {
    return null;
  }

  const isItemLoading = todo.id === 0 || isLoading;

  const handleSave = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onSelect(todo.id);

      return;
    }

    updated({
      ...todo,
      title: trimmedTitle,
    })
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label
        className="todo__status-label"
        onClick={() => {
          updated({
            ...todo,
            completed: !todo.completed,
          });
        }}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSave}
            onKeyUp={handleKeyUp}
            autoFocus
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
          onClick={() => onSelect(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isItemLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
