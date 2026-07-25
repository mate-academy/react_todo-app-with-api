/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todoId: number) => void;
  onUpdate?: (updatedTodo: Todo) => Promise<void> | void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveTitle = (event: React.FormEvent | React.FocusEvent) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const NewTrimmedTitle = newTitle.trim();

    if (NewTrimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!NewTrimmedTitle) {
      onDelete?.(todo.id);

      return;
    }

    setIsSubmitting(true);

    onUpdate?.({ ...todo, title: NewTrimmedTitle })
      ?.then(() => {
        setIsEditing(false);
      })
      .catch(() => {})
      .finally(() => {
        setIsSubmitting(false);
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
          onChange={() => {
            onUpdate?.({ ...todo, completed: !todo.completed });
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSaveTitle}>
          <input
            data-cy="TodoTitleField"
            className="todo__title-field"
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSaveTitle}
            autoFocus
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setNewTitle(todo.title);
                setIsEditing(false);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setNewTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete?.(todo.id);
            }}
          >
            ×
          </button>
        </>
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
