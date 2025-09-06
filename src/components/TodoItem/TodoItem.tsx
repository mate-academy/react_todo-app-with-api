/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';
import { useEffect, useRef, useState } from 'react';

type TodoProps = {
  todo: Todo;
  loading?: boolean;
  onDelete: (todoId: number) => void;
  onStatusChange: (todoId: number) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
};
export const TodoItem: React.FC<TodoProps> = ({
  todo,
  loading,
  onDelete,
  onStatusChange,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [shouldFocus, setShouldFocus] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus) {
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }

    setShouldFocus(false);
  }, [shouldFocus]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      onDelete(todo.id);
    } else if (trimmedTitle !== todo.title) {
      onUpdate(todo.id, { title: trimmedTitle })
        .then(() => setIsEditing(false))
        .catch(() => {
          setShouldFocus(true);
        });
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={`todo-${todo.id}`}
          onChange={() => onStatusChange(todo.id)}
          disabled={loading}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            ref={titleRef}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleSubmit}
            disabled={loading}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                setEditedTitle(todo.title);
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
              setShouldFocus(true);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={loading}
          >
            ×
          </button>
        </>
      )}
      <TodoLoader isActive={loading} />
    </div>
  );
};
