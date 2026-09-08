import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface TodoProps {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (id: number) => Promise<void>;
  onComplete?: (id: number, completed: boolean) => void;
  onEdit?: (id: number, title: string) => Promise<void>;
}

export const TodoItem: React.FC<TodoProps> = ({
  todo,
  isLoading = false,
  onDelete = () => Promise.resolve(),
  onComplete = () => {},
  onEdit = () => Promise.resolve(),
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [field, setField] = useState<string>(todo.title);

  const inputField = useRef<HTMLInputElement>(null);
  const isCancelling = useRef(false);

  useEffect(() => {
    if (isEditing) {
      inputField.current?.focus();
    }
  }, [isEditing]);

  const startEdit = useCallback(() => {
    setField(todo.title);
    setIsEditing(true);
  }, [todo.title]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | null = null) => {
    e?.preventDefault();

    const newTitle = field.trim();

    if (newTitle === todo.title) {
      setIsEditing(false);
      return;
    }

    if (newTitle.length === 0) {
      onDelete(todo.id).catch(() => {});
      return;
    }

    onEdit(todo.id, newTitle)
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      isCancelling.current = true;
      setField(todo.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (isCancelling.current) {
      isCancelling.current = false;
      return;
    }

    handleSubmit();
  };

  return (
    <>
      {/* This is a completed todo */}
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label" aria-label="Toggle todo status">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => onComplete(todo.id, !todo.completed)}
          />
        </label>

        {!isEditing ? (
          <span data-cy="TodoTitle" className="todo__title" onDoubleClick={startEdit}>
            {todo.title}
          </span>
        ) : (
          <form
            onSubmit={e => handleSubmit(e)}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              onKeyUp={(e) => handleKeyUp(e)}
              value={field}
              onBlur={handleBlur}
              onChange={e => setField(e.target.value)}
              ref={inputField}
            />
          </form>
        )}

        {/* Remove button appears only on hover */}
        { !isEditing && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        )}


        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
