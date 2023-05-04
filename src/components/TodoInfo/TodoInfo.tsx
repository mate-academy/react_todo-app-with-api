import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  deleting?: boolean;
  onUpdateTodo: (id: number, data: Partial<Todo>) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputElement = useRef<HTMLInputElement>(null);

  const updateTodoTitle = () => {
    if (editedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!editedTitle.trim()) {
      onDelete(todo.id);
    }

    onUpdateTodo(todo.id, { title: editedTitle });
    setIsEditing(false);
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleInputSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    updateTodoTitle();
  };

  const handleCancelEditing = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  useEffect(() => {
    if (isEditing && inputElement.current) {
      inputElement.current.focus();
    }
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
              ref={inputElement}
              className="todo__title-field"
              type="text"
              value={editedTitle}
              onChange={handleChangeTitle}
              onBlur={updateTodoTitle}
              onKeyUp={handleCancelEditing}
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
