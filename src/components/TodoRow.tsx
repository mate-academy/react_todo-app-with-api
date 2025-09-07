/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { useState, useRef, useEffect } from 'react';

type Props = {
  todo: Todo;
  onDelete?: () => Promise<void>;
  onRename?: (title: string) => Promise<boolean>;
  onToggle?: () => Promise<void>;
  isLoading?: boolean;
};

export const TodoRow: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete = async () => {},
  onRename = async () => {},
  onToggle = async () => {},
}) => {
  const [edited, setEdited] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edited && inputRef.current) {
      inputRef.current.focus();
    }
  }, [edited]);

  const handleRemoveClick = () => {
    setEdited(false);
    setTitle('');
    onDelete();
  };

  const handleEditSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      await onDelete();

      return;
    }

    if (trimmedTitle === todo.title) {
      setEdited(false);

      return;
    }

    const success = await onRename(trimmedTitle);

    if (success) {
      setEdited(false);
    }
  };

  const handleToggle = () => {
    onToggle();
    setEdited(false);
  };

  const handleBlur = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      await onDelete();

      return;
    }

    if (trimmedTitle === todo.title) {
      setEdited(false);

      return;
    }

    const success = await onRename(trimmedTitle);

    if (success) {
      setEdited(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEdited(false);
      setTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <span className="visually-hidden"></span>
      </label>

      {edited ? (
        <form onSubmit={e => handleEditSubmit(e)}>
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEdited(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemoveClick}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
