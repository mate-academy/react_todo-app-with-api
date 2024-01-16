import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onTodoDelete?: () => Promise<void>;
  onTodoUpdate?: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onTodoDelete,
  onTodoUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);

  const updatedTitleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && updatedTitleField.current) {
      updatedTitleField.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    onTodoUpdate?.({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedUpdatedTitle = updatedTitle.trim();

    if (!trimmedUpdatedTitle) {
      onTodoDelete?.();

      return;
    }

    if (todo.title === trimmedUpdatedTitle) {
      setIsEditing(false);

      return;
    }

    try {
      await onTodoUpdate?.({
        ...todo,
        title: trimmedUpdatedTitle,
      });

      setIsEditing(false);
    } catch (error) {
      if (updatedTitleField.current) {
        updatedTitleField.current.focus();
      }

      throw new Error('Some error occured');
    }
  };

  const handleEscapeClick = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setUpdatedTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      {!isEditing ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onTodoDelete}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            onBlur={handleSubmit}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={updatedTitleField}
            value={updatedTitle}
            onChange={(event) => {
              setUpdatedTitle(event.target.value);
            }}
            onKeyUp={handleEscapeClick}
          />
        </form>
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
