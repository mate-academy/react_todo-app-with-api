import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { Loader } from '../Loader/Loader';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (todo: Todo, newTitle: string) => Promise<void>
  isActive?: boolean;
  onToggle: (todo: Todo) => Promise<void>;
}

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    onDelete,
    onUpdate,
    isActive,
    onToggle,
  } = props;

  const {
    id,
    title,
    completed,
  } = todo;

  const newTitle = useRef<HTMLInputElement>(null);

  const [isClicked, setIsClicked] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  useEffect(() => {
    if (newTitle.current && isClicked) {
      newTitle.current.focus();
    }
  }, [isClicked]);

  const handleFormVisibility = () => setIsClicked(true);

  const handleTodoRemoving = useCallback(() => onDelete(id), []);

  const handleToggling = () => onToggle(todo);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setUpdatedTitle(title);
        setIsClicked(false);
      }
    }, [title],
  );

  const updateTitle = useCallback(() => {
    const trimmedTitle = updatedTitle.trim();

    if (trimmedTitle === title) {
      setIsClicked(false);
      setUpdatedTitle(title);

      return;
    }

    if (trimmedTitle) {
      onUpdate(todo, trimmedTitle);
    } else {
      onDelete(id);
    }

    setIsClicked(false);
  }, [title, updatedTitle]);

  const handleOnBlur = () => updateTitle();

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      updateTitle();
    }, [updateTitle],
  );

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
          defaultChecked
          onChange={handleToggling}
        />
      </label>

      {isClicked ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={newTitle}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={(event) => setUpdatedTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleOnBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleFormVisibility}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleTodoRemoving}
          >
            ×
          </button>
        </>
      )}

      {(isActive || id === 0) && (
        <Loader />
      )}
    </div>
  );
};
