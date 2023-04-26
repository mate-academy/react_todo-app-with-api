import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (id: number, title: string) => void;
  onChangeComplete: (id: number) => void
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoading,
  onDeleteTodo,
  onUpdateTodo,
  onChangeComplete,
}) => {
  const { id, completed, title } = todo;

  const [hasChange, setHasChange] = useState(false);
  const [query, setQuery] = useState(title);

  const handleTitleUpdate = useCallback(() => {
    if (!query.trim()) {
      onDeleteTodo(id);
    } else if (query !== title) {
      onUpdateTodo(id, query);
    }

    setHasChange(false);
  }, [query]);

  const handleSumit = (event: React.FormEvent) => {
    event.preventDefault();
    handleTitleUpdate();
  };

  const inputTitle = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setQuery(title);
    setHasChange(false);
  };

  useEffect(() => {
    if (inputTitle.current !== null) {
      inputTitle.current.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [hasChange]);

  return (
    <div
      key={id}
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => onChangeComplete(id)}
          checked={completed}
        />
      </label>

      {!hasChange && (
        <span
          className="todo__title"
          onDoubleClick={() => setHasChange(true)}
        >
          {title}
        </span>
      )}

      {hasChange && (
        <form onSubmit={handleSumit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            ref={inputTitle}
          />
        </form>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDeleteTodo(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
