/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo | Omit<Todo, 'id'>;
  isTemp?: boolean;
  handleDelete?: (todoId: number) => Promise<void>;
  isLoading?: boolean;
  isUpdating?: boolean;
  handleUpdate?: (
    todoId: number,
    updatedFields: Partial<Todo>,
  ) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isTemp = false,
  handleDelete,
  isLoading: isDeleting = false,
  isUpdating = false,
  handleUpdate,
}) => {
  const showLoader = isTemp || isDeleting || isUpdating;
  const todoIdForPermanent = (todo as Todo).id;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  const handleEditSubmit = async (
    // eslint-disable-next-line
    event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    if ('preventDefault' in event) {
      event.preventDefault();
    }

    if (isTemp || !handleUpdate || !handleDelete) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle === '') {
      try {
        await handleDelete(todoIdForPermanent);
        setIsEditing(false);
      } catch (err) {}

      return;
    }

    if (trimmedTitle !== todo.title) {
      try {
        await handleUpdate(todoIdForPermanent, { title: trimmedTitle });
        setIsEditing(false);
      } catch (err) {}
    }
  };

  return (
    <div
      data-cy="Todo"
      key={isTemp ? 'temp-todo' : todoIdForPermanent}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label
        className="todo__status-label"
        htmlFor={isTemp ? 'temp-status' : `todo-status-${todoIdForPermanent}`}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={isTemp ? 'temp-status' : `todo-status-${todoIdForPermanent}`}
          disabled={isDeleting || isUpdating || isTemp}
          onChange={() => {
            if (handleUpdate && !isTemp) {
              handleUpdate(todoIdForPermanent, { completed: !todo.completed });
            }
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty title will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyUp={handleKeyUp}
            ref={inputRef as React.RefObject<HTMLInputElement>}
            disabled={isUpdating}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              if (!isTemp) {
                setIsEditing(true);
              }
            }}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              if (handleDelete && !isTemp) {
                handleDelete(todoIdForPermanent);
              }
            }}
            disabled={showLoader}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': showLoader,
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
