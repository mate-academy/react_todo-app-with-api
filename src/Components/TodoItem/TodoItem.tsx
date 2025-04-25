import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todo: Todo;
  onDeleteTodo: (value: number) => Promise<void>;
  onUpdateTodoStatus: (todo: Todo) => Promise<void>;
  updateTodoTitle: (todoToUpdate: Todo) => Promise<void>;
  setErrorMessage: (value: ErrorType) => void;
  isLoading: boolean;
  loadingByIds: boolean;
  isBeingDeleted: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  loadingByIds,
  isBeingDeleted,
  onDeleteTodo = () => {},
  onUpdateTodoStatus = () => {},
  updateTodoTitle = () => {},
  setErrorMessage = () => {},
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDelete = () => {
    onDeleteTodo(id);
  };

  const handleStatusChange = () => {
    onUpdateTodoStatus(todo);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    if (newTitle.trim() === '') {
      onDeleteTodo(id).catch(() => {
        setErrorMessage(ErrorType.DELETE);
      });

      return;
    }

    if (updateTodoTitle) {
      updateTodoTitle({ ...todo, title: newTitle.trim() })
        .then(() => setIsEditing(false))
        .catch(() => {
          setIsEditing(true);
          setErrorMessage(ErrorType.UPDATE);
        });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleBlur = () => {
    handleUpdate();
  };

  const handleKeyDown = (even: React.KeyboardEvent) => {
    if (even.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }

    if (even.key === 'Enter') {
      if (newTitle !== title) {
        handleUpdate();
      } else if (newTitle.trim() === title.trim()) {
        setIsEditing(false);
      }
    }
  };

  const handleRenameSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setNewTitle(newTitle.trim());

    handleUpdate();
  };

  const shouldShowLoader = (!id && isLoading) || isBeingDeleted || loadingByIds;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onDoubleClick={handleDoubleClick}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`input-${id}`}>
        <input
          id={`input-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={handleStatusChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleRenameSubmit}>
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
          disabled={isBeingDeleted}
        >
          ×
        </button>
      )}

      {/* overlay завжди показується при isTemp, updating або deleting */}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': shouldShowLoader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
