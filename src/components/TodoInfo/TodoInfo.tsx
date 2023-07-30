import React, {
  useState, KeyboardEvent, useRef, useEffect, FormEvent, FocusEvent,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: number) => void;
  onStatusChange: (todoId: number, completed: boolean) => void;
  onTitleChange: (id: number, title: string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoading = true,
  onDelete,
  onStatusChange,
  onTitleChange,
}) => {
  const { id, title, completed } = todo;

  const [isEdited, setIsEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const inputElement = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  });

  const handleTitleChange = async (event: FormEvent<HTMLFormElement>
  | FocusEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (newTitle.trim() === '') {
      onDelete(id);
    }

    if (title !== newTitle) {
      onTitleChange(id, newTitle);
    }

    setIsEdited(false);
  };

  const handleCancelEdit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsEdited(false);
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onStatusChange(id, completed)}
        />
      </label>

      {isEdited ? (
        <form onSubmit={handleTitleChange}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleTitleChange}
            onKeyUp={handleCancelEdit}
            ref={inputElement}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEdited(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
