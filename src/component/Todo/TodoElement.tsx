import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo | null;
  onDelete?: (todoId: number) => void;
  idsToDelete: number[];
  handleTodoToggle?: (todo: Todo) => void;
  onTitleUpdate?: (todo: Todo, title: string) => Promise<void>;
};

export const TodoElement = ({
  todo,
  onDelete = () => {},
  idsToDelete,
  handleTodoToggle = () => {},
  onTitleUpdate = async () => {},
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(todo?.title || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!todo) {
    return null;
  }

  const handleSubmit = async () => {
    const trimmed = value.trim();

    if (!trimmed) {
      onDelete(todo.id);

      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await onTitleUpdate(todo, trimmed);
      setIsEditing(false);
    } catch {}
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo temp-item-enter-active', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleTodoToggle(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={event => event.preventDefault()}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            type="text"
            value={value}
            onChange={event => setValue(event.target.value)}
            onBlur={handleSubmit}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSubmit();
              }

              if (e.key === 'Escape') {
                setValue(todo.title);
                setIsEditing(false);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': idsToDelete.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
