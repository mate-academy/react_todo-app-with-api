import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Todo } from '../../types/Todo';

import { Loader } from '../Loader';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void,
  onToggle: (todo: Todo) => Promise<void>,
  onUpdate: (todo: Todo, newTitle: string) => void,
  isAdding?: boolean,
}

export const TodoItem: React.FC<Props> = ({ 
  todo,
  onDelete,
  onToggle,
  onUpdate,
  isAdding
}) => {
  const { id, completed, title } = todo;

  const [isClicked, setIsClicked] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState([0]);

  const newTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTitle.current && isClicked) {
      newTitle.current.focus();
    }
  }, [isClicked]);

  const updateTitle = () => {
    const trimmedTitle = updatedTitle.trim();

    if (trimmedTitle === title) {
      setIsClicked(false);
      setUpdatedTitle(title);

      return;
    }

    if (trimmedTitle) {
      onUpdate(todo, trimmedTitle);
    } else {
      setLoadingTodoIds(previousIds => [...previousIds, id]);
      setIsLoading(true);
      onDelete(id);
    }

    setIsClicked(false);
  };

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      updateTitle();
    }, [updateTitle],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setUpdatedTitle(title);
        setIsClicked(false);
      }
    }, [title],
  );

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={async () => {
            setLoadingTodoIds(previousIds => [...previousIds, id]);
            setIsLoading(true);
            await onToggle(todo);
            setIsLoading(false);
            setLoadingTodoIds([0]);
          }}
          defaultChecked
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
            onBlur={() => updateTitle()}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsClicked(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              setLoadingTodoIds(previousIds => [...previousIds, id]);
              setIsLoading(true);
              onDelete(id);
            }}
          >
            ×
          </button>
        </>
      )}

      <Loader
        isAdding={isAdding}
        isLoading={isLoading}
        id={id}
        loadingTodoIds={loadingTodoIds}
      />

    </div>
);
}
