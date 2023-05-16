import React, { FC, FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  removeTodo: (todoData: Todo) => void;
  onChangeTodo: (todo: Todo, value: boolean | string) => void;
}

export const TodoComponent: FC<Props> = React.memo(({
  todo,
  removeTodo,
  onChangeTodo,
}) => {
  const { title, completed } = todo;

  const [query, setQuery] = useState(title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDeleteTodo = () => {
    removeTodo(todo);
  };

  const updateTitle = () => {
    setIsUpdating(false);

    if (title === query) {
      setQuery(title);

      return;
    }

    if (query.trim() === '') {
      handleDeleteTodo();
      setQuery(title);

      return;
    }

    onChangeTodo(todo, query);

    setQuery(title);
  };

  const handleSubmitUpdate = (event: FormEvent) => {
    event.preventDefault();

    updateTitle();
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={(event) => onChangeTodo(todo, event.target.checked)}
        />
      </label>

      {!isUpdating
        ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsUpdating(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteTodo}
            >
              ×
            </button>
          </>
        )
        : (
          <form
            onSubmit={handleSubmitUpdate}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => {
                updateTitle();
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setIsUpdating(false);
                  setQuery(title);
                }
              }}
              // eslint-disable-next-line
              autoFocus
            />
          </form>
        )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
