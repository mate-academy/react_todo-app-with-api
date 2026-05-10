/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  updateChecked: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  updateTodoTitle: (id: number, title: string) => Promise<void>;
  onError?: (message: string) => void;
  isLoading?: boolean;
};

export const TodoItem = ({
  todo,
  updateChecked,
  deleteTodo,
  isLoading = false,
  updateTodoTitle,
  onError,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isCancellingRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSaveTitle = async () => {
    if (isSaving || isCancellingRef.current) {
      isCancellingRef.current = false;

      return;
    }

    const normalizedTitle = editTitle.trim();

    if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!normalizedTitle) {
      await deleteTodo(todo.id);

      return;
    }

    setIsSaving(true);
    try {
      await updateTodoTitle(todo.id, normalizedTitle);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error.message);
      }

      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    }

    if (e.key === 'Escape') {
      isCancellingRef.current = true;
      setIsEditing(false);
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
          onChange={() => updateChecked(todo)}
          disabled={isLoading || isSaving}
        />
      </label>
      {isEditing ? (
        <input
          ref={inputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveTitle}
          disabled={isSaving}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
          disabled={isLoading || isSaving}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || isSaving,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
