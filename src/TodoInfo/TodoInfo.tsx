import cn from 'classnames';
import {
  memo,
  useState,
  useEffect,
  useRef,
} from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  onDeleteTodo: (id: number) => void,
  onStatusChange: (id: number) => void,
  loadingTodosIds: number [],
  onTitleChange: (id: number, newTitle: string) => void,
  setDeleted: (boolean: boolean) => void;
}

export const TodoInfo: React.FC<Props> = memo(({
  todo,
  onDeleteTodo,
  onStatusChange,
  loadingTodosIds,
  onTitleChange,
  setDeleted,
}) => {
  const { title, completed, id } = todo;
  const [isDoubleClicked, setDoubleClicked] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTitleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = currentTitle.trim();

    if (title === trimmedTitle) {
      setDoubleClicked(false);

      return;
    }

    if (!trimmedTitle) {
      onDeleteTodo(id);

      return;
    }

    onTitleChange(id, trimmedTitle);
    setDoubleClicked(false);

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    onDeleteTodo(+e.currentTarget.value);
    setDeleted(true);
  };

  const handleEscape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && inputRef.current) {
      setCurrentTitle(title);
      // inputRef.current.blur();
      setDoubleClicked(false);
    }
  };

  useEffect(() => {
    if (isDoubleClicked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDoubleClicked]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onStatusChange(id)}
          checked={completed}
        />
      </label>

      <div onDoubleClick={() => setDoubleClicked(true)}>
        {isDoubleClicked
          ? (
            <form onSubmit={handleTitleUpdate}>
              <input
                ref={inputRef}
                type="text"
                data-cy="TodoTitle"
                className="todo__title"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                onBlur={handleTitleUpdate}
                onKeyDown={handleEscape}
              />
            </form>
          )
          : (
            <p
              data-cy="TodoTitle"
              className="todo__title"
            >
              {title}
            </p>
          )}
      </div>

      {!isDoubleClicked
        && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            value={id}
            onClick={handleDelete}
            onBlur={() => setDeleted(false)}
          >
            ×
          </button>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodosIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
