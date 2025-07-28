import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onToggle: () => void | Promise<void>;
  isLoading?: boolean;
  onDeleted: (id: number) => void;
  onEditSubmit: (
    id: number,
    oldTitle: string,
    newTitle: string,
  ) => void | Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  isLoading,
  onDeleted,
  onEditSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const { id, title, completed } = todo;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, todo.id]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditingTitle(todo.title);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleEditSubmit = async () => {
    try {
      await onEditSubmit(todo.id, todo.title, editingTitle);
      if (editingTitle.trim() !== '') {
        setIsEditing(false);
      }
    } catch {
      // should stay open
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todo-${id}`}>
        <input
          id={`todo-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          checked={completed}
          className="todo__status"
          onChange={onToggle}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editingTitle}
          onChange={handleEditChange}
          onKeyDown={handleKeyDown}
          onBlur={handleEditSubmit}
          disabled={isLoading}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleted(id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
