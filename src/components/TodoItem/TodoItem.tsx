import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemove: (todoId: number) => void,
  isBeingAdded: boolean,
  onUpdate: (props: Partial<Todo>) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemove,
  isBeingAdded,
  onUpdate,
}) => {
  const { title, completed, id } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isInputShowing, setIsInputShowing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancelEdit = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsInputShowing(false);
    }
  };

  const handleStatus = () => {
    onUpdate({ completed: !todo.completed });
  };

  const handleRename = () => {
    if (!newTitle) {
      onRemove(id);
    }

    if (title !== newTitle) {
      onUpdate({ title: newTitle });
    }
  };

  useEffect(() => {
    if (isBeingAdded) {
      inputRef.current?.focus();
    }
  }, [isBeingAdded]);

  return (
    <div className={classNames('todo',
      { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatus}
        />
      </label>

      {isInputShowing
        ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleRename();
            }}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
              onBlur={handleRename}
              onKeyDown={handleCancelEdit}
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsInputShowing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemove(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isBeingAdded },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
