import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { updateTodoTitle } from '../api/todos';
import { Todo } from '../types/Todo';
import { Notifications } from '../types/Notifications';

interface Props {
  todo: Todo,
  setNotification: (value: Notifications) => void,
  togleStatus: (
    id: number,
    completed: boolean,
    isLoading: (value: boolean) => void) => void,
  removeTodo: (id: number) => void,
  activeTodosIds: number[],
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  setNotification,
  togleStatus,
  removeTodo,
  activeTodosIds,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

  const [isUpdating, setIsUpdating] = useState(false);
  const [query, setQuery] = useState(title);
  const [hasClicked, setHasClicked] = useState(false);

  const newTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTitle.current) {
      newTitle.current.focus();
    }
  });

  const handleTitleChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (title === query) {
      setHasClicked(false);

      return;
    }

    setIsUpdating(true);

    try {
      if (query) {
        await updateTodoTitle(id, query);
      } else {
        removeTodo(id);
      }
    } catch {
      setNotification(Notifications.Update);

      setTimeout(() => {
        setNotification(Notifications.None);
      }, 3000);
    }

    setIsUpdating(false);
    setHasClicked(false);
  };

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
          onClick={() => togleStatus(id, completed, setIsUpdating)}
        />
      </label>

      {hasClicked
        ? (
          <form
            onSubmit={handleTitleChange}
            onBlur={handleTitleChange}
          >
            <input
              date-cy="TodoTitleField"
              className="todo__title-field"
              ref={newTitle}
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setHasClicked(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => removeTodo(id)}
            >
              ×
            </button>
          </>
        )}

      {(activeTodosIds.includes(id) || isUpdating) && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div
            className="modal-background has-background-white-ter"
          />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
