import {
  memo,
  useRef,
  useState,
  useEffect,
} from 'react';
import classNames from 'classnames';

import { ErrorMessage, Todo } from '../types';

type Props = {
  todo: Todo;
  onToggle?: (todo: Todo) => Promise<void>;
  onDelete?: (todo: Todo) => Promise<void>;
  onEdit?: (todo: Todo, title: string) => Promise<void>;
  onError?: (message: ErrorMessage) => void;
  processing?: boolean;
};

export const TodoItem:React.FC<Props> = memo(({
  todo,
  onToggle = () => new Promise(() => {}),
  onDelete = () => new Promise(() => {}),
  onEdit = () => new Promise(() => {}),
  onError = () => {},
  processing = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [isEditing]);

  const handleToggleClick = () => {
    onToggle(todo)
      .catch(() => onError(ErrorMessage.UpdateTodo));
  };

  const handleDeleteClick = () => {
    onDelete(todo)
      .catch(() => onError(ErrorMessage.DeleteTodo));
  };

  const submitEdit = () => {
    const title = inputValue.trim();

    if (title === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!title) {
      onDelete(todo)
        .then(() => setIsEditing(false))
        .catch(() => {
          onError(ErrorMessage.DeleteTodo);
          focusInput();
        });
    } else {
      onEdit(todo, title)
        .then(() => setIsEditing(false))
        .catch(() => {
          onError(ErrorMessage.UpdateTodo);
          focusInput();
        });
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    submitEdit();
  };

  const handleEditKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setInputValue(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleClick}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            data-cy="TodoDelete"
            className="todo__remove"
            onClick={handleDeleteClick}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={inputValue}
            onChange={event => setInputValue(event.target.value)}
            onBlur={submitEdit}
            onKeyUp={handleEditKeyUp}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': processing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
