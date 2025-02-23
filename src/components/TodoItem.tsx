import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  isLoading?: boolean;
  toggleTodo?: () => void;
  onRename?: (newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  isLoading,
  toggleTodo,
  onRename = () => Promise.resolve(),
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      titleRef.current?.focus();
    }
  }, [editing]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (normalizedTitle === todo.title) {
      setEditing(false);

      return;
    }

    if (!normalizedTitle) {
      deleteTodo(todo.id);

      return;
    }

    try {
      if (onRename) {
        await onRename(normalizedTitle);
      }

      setEditing(false);
    } catch (error) {
      titleRef.current?.focus();
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label aria-label="Todo status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleTodo}
        />
      </label>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
            ref={titleRef}
            onBlur={handleSubmit}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditing(false);
                setTitle(todo.title);
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
              setEditing(true);
              setTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
