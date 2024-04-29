import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { useTodos } from '../utils/TodoContext';
import { Errors } from '../types/ErrorsTodo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    isLoading,
    setErrorMessage,
    modifiedTodoId,
    deleteTodo,
    updateTodo,
    handleCompleted,
    setIsLoading,
  } = useTodos();
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isLoading && isEditing && titleRef.current) {
      titleRef.current?.focus();
    }
  }, [isEditing, isLoading]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const trimmedTitle = updatedTitle.trim();

    if (trimmedTitle === title || !trimmedTitle) {
      if (!trimmedTitle) {
        await deleteTodo(id);
      }

      setIsEditing(false);
      setUpdatedTitle(title);
      setIsLoading(false);

      return;
    }

    try {
      setIsLoading(true);
      await updateTodo({ ...todo, title: trimmedTitle });
      setIsEditing(false);
    } catch {
      setErrorMessage(Errors.UpdateTodo);
      if (titleRef.current) {
        titleRef.current.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleDeleteClick = () => {
    deleteTodo(id);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompleted(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={handleInputChange}
            ref={titleRef}
            onBlur={handleSubmit}
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
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteClick}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': id === modifiedTodoId,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
