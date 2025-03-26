/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Loader } from '../../types/Loader';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  changeTodo: (todo: Todo, onSuccessUpdate?: () => void) => void;
  loader: Loader | null;
  error: boolean;
  changeId: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed, userId },
  deleteTodo,
  changeTodo,
  loader,
  error,
  changeId,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [error, showInput]);

  const handleDelete = () => {
    changeId(id);
    deleteTodo(id);
  };

  const handleShowInput = () => {
    setShowInput(true);
    setQuery(title);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const onErrorUpdate = () => {
    setShowInput(true);
  };

  const handleChangeTodo = (e: FormEvent) => {
    e.preventDefault();

    if (query.trim() === title) {
      setShowInput(false);

      return;
    }

    if (error) {
      return;
    }

    if (query.length === 0) {
      deleteTodo(id);
      changeId(id);

      return;
    }

    setShowInput(false);

    changeTodo(
      { id, title: query.trim(), completed, userId: userId },
      onErrorUpdate,
    );
    changeId(id);
  };

  const handleEscape = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Escape') {
      setShowInput(false);
    }
  };

  const handleChangeCompleted = () => {
    changeId(id);
    changeTodo({ id, title, completed: !completed, userId: userId });
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeCompleted}
        />
      </label>

      {!showInput && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleShowInput}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      {showInput && (
        <form
          onBlur={handleChangeTodo}
          onSubmit={handleChangeTodo}
          onKeyDown={handleEscape}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loader?.loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
