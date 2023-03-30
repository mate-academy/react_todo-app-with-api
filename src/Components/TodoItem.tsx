import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  processedTodos: number[],
  onDelete: (id: number) => void,
  onUpdateTodo: (todo: Todo) => void,
  onUpdateTitle: (todo: Todo, newTitle: string) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  processedTodos,
  onDelete,
  onUpdateTodo,
  onUpdateTitle,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isClicked, setIsClicked] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const showForm = () => {
    setIsClicked(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsClicked(false);
    }
  };

  useEffect(() => {
    if (titleRef.current && isClicked) {
      titleRef.current.focus();
    }
  }, [isClicked]);

  const handleUpdateTitle = useCallback(() => {
    if (newTitle === title) {
      setNewTitle(title);
      setIsClicked(false);

      return;
    }

    if (!title || !newTitle) {
      onDelete(id);
    }

    onUpdateTitle(todo, newTitle);
    setIsClicked(false);
  }, [title, newTitle]);

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();

    handleUpdateTitle();
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
          defaultChecked
          onChange={() => onUpdateTodo(todo)}
        />
      </label>

      {isClicked ? (
        <form onSubmit={handleSubmitForm}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleRef}
            value={newTitle}
            onBlur={handleUpdateTitle}
            onKeyDown={handleKeyDown}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={showForm}
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
          { 'is-active': id === 0 || processedTodos.includes(id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
