import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  withLoader?: boolean,
  removeTodoOnServer: (id:number) => void,
  updateTodoOnServer: (todo: Todo, changeStatus?: boolean) => void,
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
  const [hasLoader, setHasLoader] = useState(false);
  const [query, setQuery] = useState<string>(title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setHasLoader(false);
  }, [todo]);

  const editTodo = () => {
    const editedTodo = {
      ...todo,
      title: query,
    };

    if (query === '') {
      removeTodoOnServer(id);
    }

    updateTodoOnServer(editedTodo);
    setIsEditing(false);
  };

  const handleRemove = () => {
    removeTodoOnServer(id);
    setHasLoader(true);
  };

  const handleStatusChange = () => {
    setHasLoader(true);
    updateTodoOnServer(todo, true);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (query !== todo.title) {
      setHasLoader(true);
      editTodo();
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setQuery(title);
    }
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
          onChange={handleStatusChange}
        />
      </label>
      {!isEditing
        ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleRemove}
            >
              ×
            </button>
          </>
        )
        : (
          <form
            onSubmit={(event) => handleSubmit(event)}
            onBlur={(event) => handleSubmit(event)}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyUp={(event) => handleKeyUp(event)}
            />
          </form>
        ) }
      {(hasLoader || withLoader) && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
