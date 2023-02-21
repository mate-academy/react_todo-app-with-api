import cn from 'classnames';
import React, { FormEvent, useCallback, useState } from 'react';
import { Todo, UpdateData } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: () => void,
  toDelete: boolean,
  onUpdate: (fieldsToUpdate: UpdateData) => void,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  toDelete,
  onUpdate,
}) => {
  const { title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    if (event.detail === 2) {
      setIsEditing(true);
    }
  };

  const handleToggle = () => {
    onUpdate({ completed: !completed });
  };

  const handleEscapeKey = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(title.trim());
      }
    }, [],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (newTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      onDelete();
    }

    onUpdate({ title: newTitle.trim() });
    setIsEditing(false);
  };

  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  return (
    <>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              value={newTitle}
              onBlur={handleSubmit}
              onChange={handleNewTitle}
              onKeyDown={handleEscapeKey}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={isEditing}
            />
          </form>
        ) : (
          <>
            <span
              role="none"
              className="todo__title"
              onClick={handleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay', {
        'is-active': toDelete,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
});
