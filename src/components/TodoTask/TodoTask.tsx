import classNames from 'classnames';
import {
  FC,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: object) => void;
};

export const TodoTask: FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onUpdate,
}) => {
  const {
    completed,
    title,
    id,
  } = todo;

  const [oldQuery, setOldQuery] = useState(title);
  const [isEditing, setEditing] = useState(false);
  const [query, setQuery] = useState(title);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const handleUpdateSubmiting = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query) {
      handleDelete();

      return;
    }

    onUpdate(id, { title: query });
    setEditing(false);
    setOldQuery(query);
  };

  const handleUpdateCanceling = () => {
    setEditing(false);
    setQuery(oldQuery);
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current !== null) {
      inputField.current.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleUpdateCanceling();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing]);

  return (
    <div className={classNames(
      'todo',
      {
        completed,
      },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate(id, { completed: !completed })}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={(event) => {
              handleUpdateSubmiting(event);
            }}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={handleUpdateCanceling}
              ref={inputField}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleDelete}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
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
