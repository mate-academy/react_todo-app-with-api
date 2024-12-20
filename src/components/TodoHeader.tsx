import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ErrorType } from '../types/ErrorTypes';
import classNames from 'classnames';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: Dispatch<SetStateAction<ErrorType>>;
  isInputDisabled: boolean;
  todosLength: number;
  areAllTodosCompleted: boolean;
  onToggleAll: () => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement> | null;
};

export const TodoHeader: React.FC<Props> = props => {
  const {
    onAddTodo,
    setErrorMessage,
    isInputDisabled,
    onToggleAll,
    todosLength,
    areAllTodosCompleted,
    inputRef,
  } = props;

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

      {/* Add a todo on form submit */}
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
