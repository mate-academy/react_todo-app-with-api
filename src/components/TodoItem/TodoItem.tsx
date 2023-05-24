import classNames from 'classnames';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

interface KeyboardEvent {
  key: string;
}

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading?: boolean;
  onUpdateTodo: (todoId: number, property: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    onDelete = () => true,
    isLoading,
    onUpdateTodo = () => true,
  } = props;

  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(title);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      onDelete(id);
    } else {
      onUpdateTodo(id, { title: query });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    onUpdateTodo(id, { title: query });
    setIsEditing(false);
  };

  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editField.current) {
      editField.current.focus();
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
              ref={editField}
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
              onClick={() => onDelete(id)}
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
