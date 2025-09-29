import classNames from 'classnames';
import React, { useState } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  addTodo: (title: string) => Promise<void>;
  setErrorMessage: (error: string) => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  allTodosIsComplited: boolean;
  hasTodos: boolean; // ✅ заміна isTodosEmpty
  toggleTodos: () => void;
};

export const Header: React.FC<Props> = ({
  addTodo,
  setErrorMessage,
  isInputDisabled,
  inputRef,
  allTodosIsComplited,
  hasTodos,
  toggleTodos,
}) => {
  const [title, setTitle] = useState('');

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);

      return;
    }

    addTodo(title.trim())
      .then(() => {
        setTitle('');
        setErrorMessage('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.ADD);
      });
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosIsComplited,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInput}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
