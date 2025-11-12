import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: () => void;
  isDeleting?: boolean;
  isTemp?: boolean;
  onToggleStatus?: () => void;
  isUpdating?: boolean;
  onUpdate?: (todoId: number, updatedData: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isDeleting,
  isTemp,
  onToggleStatus,
  isUpdating,
  onUpdate,
}) => {
  const inputId = `todo-${todo.id}`;
  const isLoaderActive = isTemp || isDeleting || isUpdating;

  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newTitle = editingTitle.trim();

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      onDelete?.();

      return;
    }

    try {
      await onUpdate?.(todo.id, { title: newTitle });
      setIsEditing(false);
    } catch {
      setIsEditing(true);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(event);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
      <label className="todo__status-label" htmlFor={inputId}>
        <input
          id={inputId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggleStatus}
          disabled={isLoaderActive}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit} onBlur={handleBlur}>
          <input
            data-cy="TodoTitleField"
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value.trimStart())}
            onKeyUp={handleKeyUp}
            className="todo__title-field"
            autoFocus
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

          {!isLoaderActive && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onDelete}
            >
              ×
            </button>
          )}
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoaderActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
