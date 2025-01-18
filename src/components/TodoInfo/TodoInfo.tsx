/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: () => Promise<void>;
  onUpdate?: (data: Partial<Todo>) => Promise<void>;
  isProcessing?: boolean;
  nodeRef: React.RefObject<HTMLDivElement>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete = async () => {},
  onUpdate = async () => {},
  isProcessing = false,
  nodeRef,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);

  const [isEdible, setIsEdible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formFild = useRef<HTMLInputElement>(null);

  // #region useEffects
  useEffect(() => {
    setTitle(todo.title);
    setCompleted(todo.completed);
  }, [todo.title, todo.completed]);

  useEffect(() => {
    if (isEdible) {
      formFild.current?.focus();
    }
  }, [isEdible]);
  // #endregion

  // #region delete todo and update title
  const deleteTodo = useCallback(() => {
    setIsLoading(true);
    onDelete().catch(() => setIsLoading(false));
  }, [onDelete]);

  const trimmedTitle = title.trim();

  const updateTitle = useCallback(() => {
    if (!trimmedTitle) {
      deleteTodo();
    } else {
      if (trimmedTitle !== todo.title) {
        setIsLoading(true);

        onUpdate({ title: trimmedTitle })
          .then(() => {
            setIsEdible(false);
            setTitle(trimmedTitle);
          })
          .finally(() => setIsLoading(false));
      } else {
        setIsEdible(false);
      }
    }
  }, [deleteTodo, onUpdate, todo.title, trimmedTitle]);
  // #endregion

  // #region handlers
  const handleCompletedChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;

      setIsLoading(true);

      onUpdate({ completed: newValue })
        .then(() => setCompleted(newValue))
        .finally(() => setIsLoading(false));
    },
    [onUpdate],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      updateTitle();
    },
    [updateTitle],
  );

  const handleBlur = useCallback(() => {
    updateTitle();
  }, [updateTitle]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEdible(false);
        setTitle(todo.title);
      }
    },
    [todo.title],
  );
  // #endregion

  return (
    <div
      ref={nodeRef}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompletedChange}
        />
      </label>

      {isEdible ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            ref={formFild}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={event => setTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdible(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={deleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
