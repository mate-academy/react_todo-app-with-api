/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState } from 'react';
import { TodoError, TodoServiceErrors } from '../../types/Errors';

type TodoItemProps = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (todoId: Todo['id']) => Promise<void>;
  onToggle: (todoId: Todo['id']) => Promise<void>;
  onUpdate: (todoId: Todo['id'], newTitle: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<TodoError | null>>;
  nodeRef: React.RefObject<HTMLDivElement>;
};

const TodoItemComponent = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onUpdate,
  setError,
  nodeRef,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async () => {
    try {
      await onDelete(todo.id);
      setIsEditing(false);
    } catch {
      setError?.(TodoServiceErrors.UnableToDelete);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(event.target.value);
  };

  const handleFinishEditing = async (title: string) => {
    const trimmed = title.trim();

    if (!trimmed) {
      await handleDelete();

      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await onUpdate(todo.id, trimmed);
      setIsEditing(false);
    } catch {
      setError?.(TodoServiceErrors.UnableToUpdate);
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await handleFinishEditing(updatedTitle);
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setUpdatedTitle(todo.title);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleFinishEditing(event.currentTarget.value);
  };

  useEffect(() => {
    if (isEditing) {
      setUpdatedTitle(todo.title);
      inputRef.current?.focus();
    }
  }, [isEditing, todo.title]);

  return (
    <div
      ref={nodeRef}
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
          onChange={() => onToggle?.(todo.id)}
        />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={updatedTitle}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
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
            onMouseDown={e => e.preventDefault()}
            onClick={handleDelete}
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

export const TodoItem = React.memo(TodoItemComponent);
