import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (id: number) => void;
  deleting?: boolean;
  onUpdateTodo?: (id: number, data: Partial<Todo>) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdateTodo,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputElement = useRef<HTMLInputElement>(null);

  const handleInputSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title && onDelete) {
      onDelete(todo.id);
    } else if (onUpdateTodo) {
      onUpdateTodo(todo.id, { title });
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (inputElement.current !== null) {
      inputElement.current.focus();
    }

    const handleCancel = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setTitle(todo.title);
      }
    };

    document.addEventListener('keydown', handleCancel);
  }, [isEditing]);

  return (
    <div className={classNames(
      'todo', { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdateTodo
            && onUpdateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleInputSubmit}>
            <input
              className="todo__title-field"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={() => {
                setIsEditing(false);
                setTitle(todo.title);
              }}
              ref={inputElement}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete && onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
