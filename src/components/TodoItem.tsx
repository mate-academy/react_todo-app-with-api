import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoChanges } from '../api/todos';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (todoId: number) => Promise<boolean>;
  onUpdate: (todoId: number, changes: TodoChanges) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const isSavingRef = useRef(false);
  const isEditingRef = useRef(false);

  const statusId = `todo-status-${todo.id}`;

  useEffect(() => {
    if (isEditing && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isEditing, isLoading]);

  const startEditing = () => {
    if (isLoading) {
      return;
    }

    setEditedTitle(todo.title);
    isEditingRef.current = true;
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (isSavingRef.current) {
      return;
    }

    isEditingRef.current = false;
    setIsEditing(false);
    setEditedTitle(todo.title);
  };

  const saveTitle = async () => {
    if (!isEditingRef.current || isSavingRef.current || isLoading) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    isSavingRef.current = true;

    let success = false;

    if (!trimmedTitle) {
      success = await onDelete(todo.id);
    } else {
      success = await onUpdate(todo.id, {
        title: trimmedTitle,
      });
    }

    isSavingRef.current = false;

    if (success) {
      isEditingRef.current = false;
      setIsEditing(false);
      setEditedTitle(trimmedTitle);
    } else {
      isEditingRef.current = true;
      setIsEditing(true);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    void saveTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleBlur = () => {
    void saveTitle();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={statusId}>
        <input
          id={statusId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          aria-label="Toggle todo status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => {
            void onUpdate(todo.id, {
              completed: !todo.completed,
            });
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            readOnly={isLoading}
            onChange={event => {
              setEditedTitle(event.target.value);
            }}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            aria-label="Delete todo"
            disabled={isLoading}
            onClick={() => {
              void onDelete(todo.id);
            }}
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
        <div
          className={classNames('modal-background', 'has-background-white-ter')}
        />

        <div className="loader" />
      </div>
    </div>
  );
};
