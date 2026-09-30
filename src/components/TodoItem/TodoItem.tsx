/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { KeyboardEvent, useState } from 'react';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (todoId: number) => void;
  onToggle?: (todo: Todo) => void;
  onRename?: (todoId: number, title: string) => Promise<void>;
};

export const TodoItem = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
  onRename,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const saveTitle = () => {
    const title = newTitle.trim();

    if (!title) {
      onDelete?.(todo.id);

      return;
    }

    if (title === todo.title) {
      setIsEditing(false);

      return;
    }

    if (onRename) {
      onRename(todo.id, title)
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {});
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveTitle();
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={saveTitle}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
