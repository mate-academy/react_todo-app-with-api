import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isSubmitting?: boolean;
  onUpdate: (todo: Todo) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const TodoItemComponent: React.FC<Props> = ({
  todo,
  isSubmitting = false,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setTempTitle(todo.title);
  }, [todo.title]);

  const handleSubmit = useCallback(() => {
    const trimmed = tempTitle.trim();

    if (!trimmed) {
      onDelete(todo.id)
        .then(() => cancelEditing())
        .catch(() => setIsEditing(true));

      return;
    }

    if (trimmed === todo.title) {
      cancelEditing();

      return;
    }

    onUpdate({ ...todo, title: trimmed })
      .then(() => setIsEditing(false))
      .catch(() => setIsEditing(true));
  }, [tempTitle, todo, onUpdate, onDelete, cancelEditing]);

  const handleBlur = useCallback(() => {
    if (isEditing) {
      handleSubmit();
    }
  }, [isEditing, handleSubmit]);

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        cancelEditing();
      }
    },
    [cancelEditing],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTempTitle(event.target.value);
    },
    [],
  );

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSubmit();
    },
    [handleSubmit],
  );

  const handleToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ ...todo, completed: event.target.checked });
    },
    [todo, onUpdate],
  );

  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [todo.id, onDelete]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  return (
    <section key={todo.id} className="todoapp__main" data-cy="TodoList">
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          className="todo__status-label"
          htmlFor={`todo-status-${todo.id}`}
        >
          <input
            id={`todo-status-${todo.id}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleToggle}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleFormSubmit} className="todo__title-form">
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              ref={inputRef}
              value={tempTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyUp={handleKeyUp}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDelete}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isSubmitting,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};

export const TodoItem = memo(TodoItemComponent);
