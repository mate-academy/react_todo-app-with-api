import {
  FC,
  useState,
  useEffect,
  FormEvent,
  useRef,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  loadingTodosIds: number[],
  onDelete: (todoIds: number[]) => void,
  onUpdate: (todoId: number, updatedTodo: Partial<Todo>) => void,
};

export const TodoInfo: FC<Props> = ({
  todo,
  loadingTodosIds,
  onDelete,
  onUpdate,
}) => {
  const { title, completed, id } = todo;
  const [todoTitle, setTodoTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const normalizedTitle = todoTitle.trim();

  const handleCancel = () => {
    setIsEditing(false);
    setTodoTitle(title);
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!normalizedTitle) {
      onDelete([id]);
    } else if (title !== todoTitle) {
      onUpdate(id, { title: normalizedTitle });
      setIsEditing(false);
    }

    setIsEditing(false);
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate(id, { completed: !completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            className="todo__title-field"
            type="text"
            value={todoTitle}
            onChange={e => setTodoTitle(e.target.value)}
            onBlur={handleSubmit}
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
            onClick={() => onDelete([id])}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames(
        'modal overlay',
        {
          'is-active': loadingTodosIds.includes(id),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
