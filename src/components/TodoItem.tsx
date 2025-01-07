/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FormEvent, useEffect, useState, useRef } from 'react';
import { errors } from '../constans/Errors';

interface TodoItemProps {
  todo: Todo;
  onDelete: (postId: number) => Promise<void>;
  isSubmitting: boolean;
  isLoading: boolean;
  onUpdate: (todo: Todo) => Promise<void>;
  setError: (error: string) => void;
}
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  onUpdate,
  isSubmitting,
  isLoading,
  setError,
}) => {
  const { id, completed, title } = todo;
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setIsRenaming(false), [todo]);

  const handleTodoDeleteButton = () => {
    setIsUpdating(true);
    onDelete(todo.id)
      .catch(() => {
        setError(errors.delete);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === title) {
      setIsRenaming(false);

      return;
    }

    if (!trimmedNewTitle) {
      setIsUpdating(true);
      onDelete(id)
        .catch(() => {
          setError(errors.delete);
        })
        .finally(() => {
          setIsUpdating(false);
        });

      return;
    }

    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    onUpdate({ ...todo, title: trimmedNewTitle })
      .then(() => {
        setIsRenaming(false);
      })
      .catch(() => {
        setError(errors.update);
        setIsRenaming(true);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const handleStatusChange = () => {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    onUpdate({ ...todo, completed: !completed })
      .catch(() => {
        setError(errors.update);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
        />
      </label>
      {isRenaming ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setIsRenaming(false);
            }
          }}
        >
          <input
            autoFocus
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsRenaming(true);
              setNewTitle(title);
            }}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleTodoDeleteButton}
            disabled={isSubmitting}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
