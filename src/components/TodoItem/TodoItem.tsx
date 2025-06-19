/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { TodoServiceErrors, TodoServiceErrorsValues } from '../../types/Errors';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => Promise<void>;
  isLoading?: boolean;
  onSubmit: (value: Todo, shouldRefocus?: boolean) => Promise<void>;
  setErrorMessage: (error: TodoServiceErrorsValues | null) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  isLoading,
  onSubmit,
  setErrorMessage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleUpdateStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCompleted = event.target.checked;

    onSubmit({
      ...todo,
      completed: newCompleted,
      title: newTitle,
    });
  };

  const updateTitle = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle.length === 0) {
      return deleteTodo(todo.id)
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {
          inputRef.current?.focus();
          setErrorMessage(TodoServiceErrors.UnableToDelete);
        });
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    return onSubmit(
      {
        ...todo,
        title: trimmedTitle,
      },
      false,
    )
      .then(() => {
        setIsEditing(false);
        setNewTitle(trimmedTitle);
      })
      .catch(() => {
        inputRef.current?.focus();
        setErrorMessage(TodoServiceErrors.UnableToUpdate);
      });
  };

  const handleEscapeKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
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
          disabled={isLoading}
          onChange={handleUpdateStatus}
        />
      </label>

      {isEditing ? (
        <form onSubmit={updateTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={() => {
              updateTitle();
            }}
            onKeyDown={handleEscapeKey}
            ref={inputRef}
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
            {newTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
