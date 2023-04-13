import classNames from 'classnames';
import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  loadingTodosIds?: number[];
  onUpdateTodo: (todoId: number, property: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    onDelete = () => true,
    loadingTodosIds,
    onUpdateTodo = () => true,
  } = props;

  const { id, title, completed } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isEdited, setIsEdited] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancelEditing = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdited(false);
      setNewTitle(title);
    }
  };

  useEffect(() => {
    if (isEdited && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdited]);

  const handleTodoDelete = async (todoId: number) => {
    await onDelete(todoId);
  };

  const handleTitleChange = () => {
    if (!title.trim()) {
      onDelete(id);
    }

    if (title.trim() === title) {
      setIsEdited(false);

      return;
    }

    setIsEdited(false);
    onUpdateTodo(id, { title: newTitle });
  };

  const handleBlur = () => {
    handleTitleChange();
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
      onDoubleClick={() => setIsEdited(true)}
    >
      <label
        className="todo__status-label"
      >
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdateTodo(id, { completed: !completed })}
        />
      </label>

      {isEdited
        ? (
          <form onSubmit={handleTitleChange}>
            <input
              type="text"
              className="todo__title-field"
              ref={inputRef}
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={handleBlur}
              onKeyUp={handleCancelEditing}
            />
          </form>
        )
        : (
          <>
            <span className="todo__title">{title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleTodoDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal',
        'overlay',
        {
          'is-active': id === 0
            || loadingTodosIds?.includes(id),
        },
      )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
