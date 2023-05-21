import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (id: number) => void,
  loadingTodo: number[];
  updateTitleOfTodo: (todo: Todo, title?: string) => Promise<void>,
  updateStatusOfTodo : (todo: Todo) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  loadingTodo,
  updateTitleOfTodo,
  updateStatusOfTodo,
}) => {
  const { id, title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isDoubleClicked]);

  const handleDoubleClick = () => {
    setIsDoubleClicked(true);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTitle.trim() === title) {
      setNewTitle(title);
    }

    if (!newTitle.trim()) {
      removeTodo(id);
    }

    setIsDoubleClicked(false);
    updateTitleOfTodo(todo, newTitle);
  };

  const handleCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsDoubleClicked(false);
    }
  };

  const handleRemoveTodo = () => {
    removeTodo(id);
  };

  const handleOnBlur = () => {
    updateTitleOfTodo(todo, newTitle);
    setIsDoubleClicked(false);
  };

  return (
    <li className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={handleInput}
          onClick={() => updateStatusOfTodo(todo)}
        />
      </label>

      {isDoubleClicked ? (
        <form
          onSubmit={handleFormSubmit}
          onBlur={handleOnBlur}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleInput}
            onKeyDown={handleCancel}
            ref={inputRef}
          />
        </form>
      ) : (
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
            onClick={handleRemoveTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': loadingTodo.includes(id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
