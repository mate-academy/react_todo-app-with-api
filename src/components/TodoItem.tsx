import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { UpdatingFunction, DeletingFunction } from '../types/Functions';
type Props = {
  isProcessed: boolean;
  onDelete: DeletingFunction;
  onUpdate: UpdatingFunction;
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onUpdate,
  onDelete,
}) => {
  const { title, completed, id } = todo;
  const [redacting, setRedacting] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (redacting && inputRef.current) {
      inputRef.current.focus();
    }

    if (!redacting && inputRef.current) {
      inputRef.current.blur();
    }
  }, [redacting]);

  const handleUpdate = () => {
    if (!newTitle.trim()) {
      onDelete(id).catch(() => setRedacting(true));
    } else if (newTitle !== title) {
      onUpdate(id, newTitle)
        .then(() => setRedacting(false))
        .catch(() => setRedacting(true));
    } else {
      setRedacting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleEscape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setRedacting(false);
      setNewTitle(todo.title);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
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
          onChange={() => onUpdate(id)}
        />
      </label>
      {!redacting ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setRedacting(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleChange}
            ref={inputRef}
            onBlur={() => handleUpdate()}
            onKeyUp={handleEscape}
          />
        </form>
      )}
      {/* Remove button appears only on hover */}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
