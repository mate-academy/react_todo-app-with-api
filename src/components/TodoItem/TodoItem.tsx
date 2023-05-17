import {
  ChangeEvent,
  FC,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deletedTodosID: number | null;
  completedTodoIds: number[] | null;
  updatingTodoIds: number[] | null;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, data: string | boolean) => void,
}

export const TodoItem: FC<Props> = (
  {
    todo,
    deletedTodosID,
    completedTodoIds,
    updatingTodoIds,
    deleteTodo,
    updateTodo,
  },
) => {
  const { id, completed, title } = todo;
  const [isUpdating, setUpdating] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleChange = () => {
    setUpdating(true);
    updateTodo(id, !completed);
  };

  const updateTitle = (query: string) => {
    if (!query?.trim()) {
      deleteTodo(id);

      return;
    }

    if (query === title) {
      setEditing(false);

      return;
    }

    setUpdating(true);
    setEditing(false);
    updateTodo(id, query);
  };

  const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    updateTitle(newTitle);
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditing(false);
      setEditedTitle(title);
    }
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    updateTitle(editedTitle);
  };

  const hasShowLoading = !id
    || deletedTodosID === id
    || completedTodoIds?.includes(id)
    || updatingTodoIds?.includes(id)
    || isUpdating;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.addEventListener('keyup', handleEscape);

    setUpdating(false);

    return (() => {
      document.removeEventListener('keyup', handleEscape);
    });
  }, [completed, title]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      className={classNames('todo is-loading', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChange}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              onBlur={handleBlur}
              ref={inputRef}
            />
          </form>
        )
        : (
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
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': hasShowLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
