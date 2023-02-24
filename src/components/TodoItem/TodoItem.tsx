import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  withLoader?: boolean,
  removeTodoOnServer: (id:number) => void,
  updateTodoOnServer: (todo: Todo) => void,
};

export const TodoItem: React.FC<Props> = (
  {
    todo, withLoader, removeTodoOnServer, updateTodoOnServer,
  },
) => {
  const {
    id,
    title,
    completed,
  } = todo;
  const [hasLoader, setHasLoader] = useState(withLoader);
  const [query, setQuery] = useState<string>(title);

  const handleRemove = () => {
    removeTodoOnServer(id);
    setHasLoader(true);
  };

  const handleStatusChange = () => {
    updateTodoOnServer(todo);
  };

  return (
    <div
      className={cn('todo', { completed: completed === true })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleStatusChange()}
        />
      </label>
      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleRemove}
      >
        ×
      </button>

      <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>

      {hasLoader && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
