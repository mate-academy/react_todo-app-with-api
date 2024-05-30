/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  handleDeletingTodo?: () => void;
  isLoading: boolean;
  handleUpdatingTodo?: (todo: Todo) => void;
  handleTogglingTodo?: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeletingTodo = () => {},
  isLoading,
  handleUpdatingTodo = () => {},
  handleTogglingTodo = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmittingUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedTitle = newTitle.trim();

    setNewTitle(preparedTitle);

    if (preparedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!preparedTitle) {
      handleDeletingTodo();

      return;
    }

    handleUpdatingTodo({ ...todo, title: preparedTitle });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTogglingTodo}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmittingUpdate}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setIsEditing(false);
            }
          }}
          onBlur={handleSubmittingUpdate}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={inputRef}
            onChange={event => setNewTitle(event.target.value)}
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
            onClick={handleDeletingTodo}
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
