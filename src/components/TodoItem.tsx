import classNames from 'classnames';
import {
  useState, useRef, useEffect, useCallback,
} from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  onDelete?: (todoId: number) => Promise<void>;
  onUpdate?: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const editedRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editedRef.current && isEdited) {
      editedRef.current.focus();
    }
  }, [isEdited]);

  const handleCompletedUpdate = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onUpdate({ ...todo, completed: event.target.checked });
  }, []);

  const handleTitleDoubleClick = useCallback(() => {
    setIsEdited(true);
  }, []);

  const handleSaving = useCallback(() => {
    if (!editTitle.trim()) {
      onDelete(todo.id);
    } else if (editTitle === todo.title) {
      setIsEdited(false);
    } else {
      onUpdate({ ...todo, title: editTitle });
      setIsEdited(false);
    }
  }, [editTitle]);

  const handleEditBlur = () => {
    handleSaving();
  };

  const handleOnKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEdited(false);
      setEditTitle(todo.title);

      return;
    }

    if (event.key === 'Enter') {
      handleSaving();
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCompletedUpdate}
        />
      </label>

      {isEdited ? (
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onKeyDown={handleOnKeyDown}
          onBlur={handleEditBlur}
          ref={editedRef}
        />
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleTitleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
