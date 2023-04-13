import {
  FC,
  useState,
  useRef,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void,
  isLoading: boolean,
  statusChange: (id: number, data: Partial<Todo>) => void,
};

export const TodoInfo: FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  statusChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setTitle] = useState(todo.title);

  const handleCancel = () => {
    setTitle(todo.title);
    setIsEditing(false);
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTitle) {
      onDelete(todo.id);
    } else {
      statusChange(todo.id, { title: newTitle });
      setIsEditing(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
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
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => statusChange(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitForm}>
          <input
            className="todo__title-field"
            type="text"
            value={newTitle}
            onChange={handleInputChange}
            onBlur={handleCancel}
            ref={inputField}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
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
