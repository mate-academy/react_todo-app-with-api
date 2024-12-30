import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ErrorType } from '../types/ErrorTypes';
import classNames from 'classnames';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: Dispatch<SetStateAction<ErrorType>>;
  isInputDisabled: boolean;
  todosLength: number;
  inputRef: React.RefObject<HTMLInputElement> | null;
  areAllTodosCompleted: boolean;
  onToggleAll: () => Promise<void>;
};

export const Header: React.FC<Props> = ({
  onAddTodo,
  setErrorMessage,
  isInputDisabled,
  todosLength,
  inputRef,
  onToggleAll,
  areAllTodosCompleted,
}) => {
  const [inputValue, setInputValue] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setErrorMessage(ErrorType.EmptyTitle);

      return;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (err) {}
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [todosLength, inputRef]);

  useEffect(() => {
    if (!isInputDisabled) {
      inputRef?.current?.focus();
    }
  }, [isInputDisabled, inputRef]);

  return (
    <header className="todoapp__header">
      {todosLength !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
