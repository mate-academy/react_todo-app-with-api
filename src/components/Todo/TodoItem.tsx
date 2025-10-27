/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState, KeyboardEvent, FormEvent, useRef, useEffect } from 'react';
type Props = {
  todo: Todo;
  loading?: boolean;
  onDelete?: (todoId: number) => void;
  onUpdateCompleted?: (todo: Todo) => void;
  onUpdateTitle?: (todoId: number, title: string) => Promise<void>;
};
export default function TodoItem({
  todo,
  loading,
  onDelete = () => {},
  onUpdateCompleted = () => {},
  onUpdateTitle,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const [queryTitle, setQueryTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && !loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, isEditing]);

  const handleDoubleClickOnInput = () => {
    setIsEditing(true);
    setQueryTitle(todo.title);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = async () => {
    if (loading) {
      return;
    }

    const newTitle = queryTitle.trim();

    if (todo.title === newTitle) {
      setIsEditing(false);

      return;
    }

    if (newTitle.length === 0) {
      setIsEditing(false);
      onDelete(todo.id);

      return;
    }

    setIsEditing(false);

    if (onUpdateTitle) {
      try {
        await onUpdateTitle(todo.id, newTitle);
      } catch {
        setIsEditing(true);
        setQueryTitle(newTitle);
      }
    }
  };

  const handleSubmitForm = async (event: FormEvent) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const newTitle = queryTitle.trim();

    if (todo.title === newTitle) {
      setIsEditing(false);

      return;
    }

    if (newTitle.length === 0) {
      onDelete(todo.id);

      return;
    }

    if (onUpdateTitle) {
      try {
        await onUpdateTitle(todo.id, newTitle);
        setIsEditing(false);
      } catch {}
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
          onClick={() => onUpdateCompleted(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitForm}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={queryTitle}
            onChange={event => setQueryTitle(event.target.value)}
            autoFocus
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClickOnInput}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
