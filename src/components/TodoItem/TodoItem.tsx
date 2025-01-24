import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todo: Todo;
  isLoading: boolean;
  loadingByIds?: boolean;
  onDelete?: (value: number) => Promise<void>;
  updateTodo?: (todoToUpdate: Todo) => Promise<void>;
  updateTodoTitle?: (todoToUpdate: Todo) => Promise<void>;
  setErrorMessage?: (value: ErrorType) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  loadingByIds = false,
  onDelete = () => {},
  updateTodo = () => {},
  updateTodoTitle = () => {},
  setErrorMessage = () => {},
}) => {
  const { completed, title, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    if (newTitle.trim() === '') {
      onDelete(id).catch(() => {
        setErrorMessage(ErrorType.ERROR_DELETE);
      });

      return;
    }

    if (updateTodoTitle) {
      updateTodoTitle({ ...todo, title: newTitle.trim() })
        .then(() => setIsEditing(false))
        .catch(() => {
          setIsEditing(true);
          setErrorMessage(ErrorType.ERROR_UPDATE);
        });
    }
  };

  const handleOnBlur = () => {
    handleUpdate();
  };

  const handleRenameSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setNewTitle(newTitle.trim());

    handleUpdate();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }

    if (event.key === 'Enter') {
      if (title.trim() === newTitle.trim()) {
        setIsEditing(false);
      }
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => updateTodo(todo)}
        />
      </label>

      {/* This form is shown instead of the title and remove button */}

      {isEditing ? (
        <form onSubmit={handleRenameSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleOnBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {!isEditing ? newTitle : title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': (!id && isLoading) || loadingByIds,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
