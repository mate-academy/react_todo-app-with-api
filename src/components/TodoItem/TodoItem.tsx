import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDeleteTodo: (id: number) => void;
  onUpdateTitle: (todo: Todo, newTitle: string) => void;
  onToggleStatus: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isLoading,
  onDeleteTodo,
  onUpdateTitle,
  onToggleStatus,
}) => {
  const { title, id, completed } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const preparedTitle = newTitle.trim();

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  function handleTitleBlur() {
    onUpdateTitle(todo, preparedTitle);
    setIsEditing(false);
  }

  function handleKeyUp(key: string) {
    if (key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  }

  return (
    <div
      data-cy="Todo"
      key={id}
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
          onClick={() => onToggleStatus(todo)}
          readOnly
        />
      </label>

      {isEditing ? (
        <form onSubmit={(e) => {
          e.preventDefault();

          handleTitleBlur();
        }}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={({ target }) => {
              setNewTitle(target.value);
            }}
            ref={titleInputRef}
            onBlur={() => handleTitleBlur()}
            onKeyUp={({ key }) => handleKeyUp(key)}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? newTitle : title}
        </span>
      )}

      {isEditing || (
        <button
          type="button"
          className="todo__remove"
          onClick={() => onDeleteTodo(id)}
        >
          ×
        </button>
      )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
