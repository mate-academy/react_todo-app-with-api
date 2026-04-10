import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loadingTodoId: number | null;
  loadingTodoIds: number[];
  handleDeleteTodo: (id: number) => void;
  changeCompleted: (todo: Todo) => void;
  handleChangeTitle: (todo: Todo) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodoId,
  loadingTodoIds,
  handleDeleteTodo,
  changeCompleted,
  handleChangeTitle,
}) => {
  const { userId, id, title, completed } = todo;
  const isActive =
    loadingTodoIds.includes(todo.id) || loadingTodoId === todo.id;

  const [isDblClicked, setIsDblClicked] = useState(false);
  const [query, setQuery] = useState(title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isDblClicked && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isDblClicked]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery === title) {
      setIsDblClicked(false);

      return;
    }

    if (!trimmedQuery) {
      handleDeleteTodo(id);

      return;
    }

    handleChangeTitle({ userId, id, title: trimmedQuery, completed }).then(
      success => {
        if (success) {
          setIsDblClicked(false);
        }
      },
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      setQuery(title);
      setIsDblClicked(false);
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        key={id}
        className={classNames('todo', {
          completed: completed,
        })}
      >
        <label className="todo__status-label">
          {/* eslint-disable-line jsx-a11y/label-has-associated-control */}
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => changeCompleted(todo)}
          />
        </label>

        {!isDblClicked ? (
          <>
            <span
              data-cy="TodoTitle"
              className={classNames('todo__title', { completed })}
              onDoubleClick={() => setIsDblClicked(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </>
        ) : (
          <form className="todo__edit-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
            />
          </form>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isActive,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
