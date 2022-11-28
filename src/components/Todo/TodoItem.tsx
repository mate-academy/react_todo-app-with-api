import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isAdding: boolean;
  removeTodoFromServer: (todoId: number) => void;
  changeTodoOnServer: (todoId: number, completed: boolean) => void;
  changeTitleOnServer: (todoId: number, title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  removeTodoFromServer,
  changeTodoOnServer,
  changeTitleOnServer,
}) => {
  const [isTitleClicked, setIsTitleClicked] = useState(false);
  const [query, setQuery] = useState(todo.title);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery === '') {
      removeTodoFromServer(todo.id);
    }

    if (trimmedQuery !== todo.title) {
      changeTitleOnServer(todo.id, query);
    }

    setIsTitleClicked(false);
  };

  const handleOnBlur = () => {
    const trimmedQuery = query.trim();

    if (trimmedQuery === '') {
      removeTodoFromServer(todo.id);
    }

    if (trimmedQuery !== todo.title) {
      changeTitleOnServer(todo.id, query);
    }

    setIsTitleClicked(false);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setQuery(todo.title);
      setIsTitleClicked(false);
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isTitleClicked]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => changeTodoOnServer(todo.id, !todo.completed)}
        />
      </label>

      {isTitleClicked
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={event => setQuery(event.target.value)}
              onBlur={handleOnBlur}
              onKeyDown={handleOnKeyDown}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsTitleClicked(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                removeTodoFromServer(todo.id);
              }}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isAdding,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
