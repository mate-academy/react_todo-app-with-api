import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoader?: boolean,
  removeTodoOnServer: (id: number) => void,
  updateTodoOnServer: (todo: Todo, isChange?: boolean) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoader,
  removeTodoOnServer,
  updateTodoOnServer,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;
  const [query, setQuery] = useState<string>(title);
  const [hasLoader, setHasLoader] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasLoader(false);
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [todo, isEditing]);

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div
      className={classNames('todo', { completed: !!completed })}
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
            onSubmit={handleSubmit}
            onBlur={handleSubmit}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={handleInputChange}
              onKeyUp={handleKeyUp}
              ref={inputRef}
            />
          </form>
        )}
      {(hasLoader || isLoader) && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
