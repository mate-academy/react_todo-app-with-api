import React, {
  memo, useCallback, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void
  onUpdate: (todoId: number) => void
  isUpdating: boolean;
  onChangeTitle: (todoId: number, title: string) => void;
}
export const TodoItem: React.FC<Props> = memo(({
  todo,
  onDelete,
  onUpdate,
  isUpdating,
  onChangeTitle,
}) => {
  const { id, title, completed } = todo;
  const [isActive, setIsActive] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdatedTitle = (todoTitle: string) => {
    setUpdatedTitle(todoTitle);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isActive]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (title === updatedTitle) {
        setIsActive(false);

        return;
      }

      onChangeTitle(id, updatedTitle);
      setIsActive(false);
    }, [updatedTitle],
  );

  const handleStopChanges = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setUpdatedTitle(title);
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keyup', handleStopChanges);

    return () => {
      document.removeEventListener('keyup', handleStopChanges);
    };
  }, []);

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate(id)}
        />
      </label>

      {!isActive ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsActive(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={(event) => handleSubmit(event)}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={(event) => handleUpdatedTitle(event.target.value)}
            ref={inputRef}
            onBlur={() => setIsActive(false)}
          />
        </form>
      )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isUpdating },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
