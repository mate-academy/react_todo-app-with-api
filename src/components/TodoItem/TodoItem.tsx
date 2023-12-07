import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (id: number) => void,
  onUpdate: (todo: Todo) => void,
  isLoading: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleToggle = () => {
    onUpdate({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle.length) {
      onDelete(todo.id);

      return;
    }

    if (todo.title === newTitle) {
      setIsEditing(false);

      return;
    }

    await onUpdate({
      ...todo,
      title: newTitle.trim(),
    });

    setIsEditing(false);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      {!isEditing ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => !isLoading && onDelete(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setNewTitle(todo.title);
                setIsEditing(false);
              }
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
