import classNames from 'classnames';
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  deletingIds: number[];
  onChangeStatus: (todo: Todo) => void;
  onChangeTitle: (id: number, newTitle: string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  deletingIds,
  onChangeStatus,
  onChangeTitle,
}) => {
  const { title, completed, id } = todo;
  const titleInput = useRef<HTMLInputElement>(null);
  const [titleIsInput, setTitleIsInput] = useState(false);
  const [query, setQuery] = useState(title);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [titleIsInput]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    if (event.detail === 2) {
      setTitleIsInput(true);
    }
  }, []);

  const escFunction = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setTitleIsInput(false);
      setQuery(title);
    }
  }, [todo]);

  const enterFunction = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setTitleIsInput(true);
    }
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (query === title) {
      setTitleIsInput(false);
      setQuery(title);

      return;
    }

    if (query === '') {
      onDelete(id);

      return;
    }

    onChangeTitle(id, query);
    setTitleIsInput(false);
  }, [query, todo]);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={() => onChangeStatus(todo)}
        />
      </label>

      {titleIsInput
        ? (
          <form
            onSubmit={handleSubmit}
            onBlur={handleSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={query}
              ref={titleInput}
              onKeyDown={escFunction}
              onChange={(event => setQuery(event.target.value))}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              role="textbox"
              tabIndex={0}
              onClick={handleClick}
              onKeyDown={enterFunction}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': (id === 0) || (deletingIds.includes(id)) },
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
