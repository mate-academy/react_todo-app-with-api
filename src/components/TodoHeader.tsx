import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';

type HeaderProps = {
  todos: Todo[],
  areAllTodosCompleted: boolean,
  handleTodoAdd: (todoTitle: string) => Promise<void>,
  setErrorMessage: (errorMessage: Error) => void,
  handleToggleAll: () => void,
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  areAllTodosCompleted,
  handleTodoAdd,
  setErrorMessage,
  handleToggleAll,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isInputDisabled]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim().length) {
      setErrorMessage(Error.TITLE);
      setTodoTitle('');

      return;
    }

    try {
      setIsInputDisabled(true);
      await handleTodoAdd(todoTitle);
    } catch {
      setErrorMessage(Error.ADD);
    } finally {
      setIsInputDisabled(false);
      setTodoTitle('');
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          aria-label="toggle"
          className={classNames(
            'todoapp__toggle-all',
            { active: areAllTodosCompleted },
          )}
          onClick={handleToggleAll}

        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInput}
          disabled={isInputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
