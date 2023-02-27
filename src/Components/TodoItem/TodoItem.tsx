import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (id: number) => Promise<void>,
  changeTodos: (todo: Todo, title?: string) => Promise<void>
  isWaiting: boolean
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  changeTodos,
  isWaiting,
}) => {
  const { title, completed, id } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeTodos(todo, newTitle);
    setIsDoubleClicked(false);
  };

  const handleChangeStatus = () => {
    changeTodos(todo);
  };

  const handleSetTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const closeFormByEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsDoubleClicked(false);
    }
  };

  const setDoubleClicked = () => {
    setIsDoubleClicked(true);
  };

  const handleRemoveTodo = () => {
    removeTodo(id);
  };

  const handleOnBlur = () => {
    changeTodos(todo, newTitle);
    setIsDoubleClicked(false);
  };

  return (
    <div className={classNames(
      'todo',
      { completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleChangeStatus}
        />
      </label>

      {isDoubleClicked ? (
        <form
          onSubmit={handleOnSubmit}
          onBlur={handleOnBlur}
        >
          <input
            type="text"
            value={newTitle}
            onChange={handleSetTitle}
            className="todo__title-field"
            onKeyDown={closeFormByEsc}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={setDoubleClicked}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleRemoveTodo}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames(
        'modal',
        'overlay',
        { 'is-active': isWaiting },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
