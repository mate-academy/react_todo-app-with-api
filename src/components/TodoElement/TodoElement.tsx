import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onTodoDeletion?: (id:number) => void,
  onTodoUpdating?: (id: number, data: Partial<Todo>) => void,
  isLoading: boolean,
};

export const TodoElement: React.FC<Props> = ({
  todo,
  onTodoDeletion,
  isLoading,
  onTodoUpdating,
}) => {
  const { completed, title, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [changedTitle, setChangedTitle] = useState(title);

  const handleTitleChanging = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangedTitle(e.target.value);
  };

  const handleTitleSubmitting = () => {
    if (changedTitle === title) {
      setIsEditing(false);
    } else if (!changedTitle.trim()) {
      onTodoDeletion?.(id);
    } else {
      setIsEditing(false);
      onTodoUpdating?.(id, { title: changedTitle });
    }
  };

  const handleTitleCancelation = () => {
    setIsEditing(false);
    setChangedTitle(title);
  };

  const hadleKeyboardEvent = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleTitleSubmitting();
    } else if (e.code === 'Escape') {
      handleTitleCancelation();
    }
  };

  return (
    <div className={
      classNames(
        'todo',
        { completed },
      )
    }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onTodoUpdating?.(id, { completed: !completed })}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__title-field"
          value={changedTitle}
          onChange={handleTitleChanging}
          onBlur={handleTitleSubmitting}
          onKeyUp={hadleKeyboardEvent}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={isEditing}
        />
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
            onClick={() => onTodoDeletion?.(id)}
          >
            ×
          </button>
        </>
      )}

      <div className={
        classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
