import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(todo.title);
    setIsEditing(false);
  }, [todo.title]);

  const submitEdit = () => {
    const trimmed = editValue.trim();

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmed) {
      onDelete(todo.id)
        .then(() => setIsEditing(false))
        .catch(() => {});

      return;
    }

    onUpdateTodo({ ...todo, title: trimmed })
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            aria-label="Toggle todo status"
            checked={todo.completed}
            onClick={() =>
              onUpdateTodo({ ...todo, completed: !todo.completed })
            }
            disabled={isLoading}
          />
        </label>

        {isEditing ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              submitEdit();
            }}
          >
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={submitEdit}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  submitEdit();
                }

                if (e.key === 'Escape') {
                  setEditValue(todo.title);
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
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
