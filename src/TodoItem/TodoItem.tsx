/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessed?: boolean;
  onDelete?: (todoId: number) => void;
  onToggle?: (todo: Todo) => void;
  onRename?: (todo: Todo, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed = false,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);
      return;
    }

    if (trimmedTitle === '') {
      onDelete?.(todo.id);
      return
    }

    try {
      await onRename?.(todo, trimmedTitle);
      setIsEditing(false);
    } catch {
      // форма остается открытой
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false)
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={editFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleSave}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            &times;
          </button>
        </>
      )}


      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
