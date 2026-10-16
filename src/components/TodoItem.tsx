/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

export interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todoId: number) => void;
  onUpdate?: (todoId: number, changes: Partial<Todo>) => Promise<boolean>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleSave = () => {
    if (isLoading) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete?.(todo.id);

      return;
    }

    onUpdate?.(todo.id, { title: trimmedTitle })?.then(isSuccess => {
      if (isSuccess) {
        setIsEditing(false);
      }
    });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate?.(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            autoFocus
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setIsEditing(false);
              }
            }}
            onBlur={handleSave}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setNewTitle(todo.title);
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
