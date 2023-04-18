import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: (todoId: number) => Promise<void>;
  onUpdate?: (id: number, body: Partial<Omit<Todo, 'id'>>) => Promise<void>;
  isLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onUpdate = () => {},
  isLoading = true,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== null && isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const changeTitle = async () => {
    const trimmedInputValue = inputValue.trim();

    if (trimmedInputValue && trimmedInputValue !== title) {
      await onUpdate(id, { title: inputValue });
    }

    if (!inputValue) {
      await onDelete(id);
    }

    setIsEditing(false);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    changeTitle();
  };

  const handleChangingStatus = async () => {
    await onUpdate(id, { completed: !completed });
  };

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={classNames('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangingStatus}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={inputValue}
              onChange={handleTyping}
              onBlur={changeTitle}
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
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
        )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
