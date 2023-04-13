import classNames from 'classnames';
import {
  FC, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (id: number) => void;
  onUpdateTodo: (
    todoId: number,
    todo: { title?: string, completed?: boolean }) => void;
}

export const TodoTask: FC<Props> = ({
  todo,
  deleteTodo,
  onUpdateTodo,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(title);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      deleteTodo(id);
    } else {
      onUpdateTodo(id, { title: query });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setQuery(title);
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current !== null) {
      inputField.current.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing]);

  return (
    <div
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdateTodo(id, { completed: !completed })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              className="todo__title-field"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={handleCancel}
              ref={inputField}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
