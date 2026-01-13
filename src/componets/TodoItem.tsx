import classNames from 'classnames';
import { Todo } from '../types/todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading: boolean;
  onUpdate: (todo: Todo) => Promise<void | never>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const editFieldRef = useRef<HTMLInputElement>(null);

  function handleNewTitle() {
    setIsEditing(true);
    setEditTitle(todo.title);
  }

  function handleRename(event: React.FormEvent) {
    event.preventDefault();

    const newTitle = editTitle.trim();

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      onDelete(todo.id);

      return;
    }

    onUpdate({ ...todo, title: newTitle })
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        editFieldRef.current?.focus();
      });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);

      return;
    }
  }

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed === true,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          aria-label="Toggle todo status"
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => onUpdate({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleRename}>
          <input
            className="todo__title-field"
            data-cy="TodoTitleField"
            autoFocus
            ref={editFieldRef}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleNewTitle}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isEditing && (
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
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
