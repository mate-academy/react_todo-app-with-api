import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  setErrorMessage: Dispatch<SetStateAction<Errors>>;
  onAddTodo: (value: string) => Promise<void>;
  isInputDisabled: boolean;
  onToggleAll: () => Promise<void>;
  todosLength: number;
  inputRef: React.RefObject<HTMLInputElement> | null;
  areAllTodosCompleted: boolean;
};

export const Header: React.FC<Props> = props => {
  const {
    setErrorMessage,
    onAddTodo,
    isInputDisabled,
    onToggleAll,
    todosLength,
    inputRef,
    areAllTodosCompleted,
  } = props;
  const [inputValue, setInputValue] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (err) {
      // eslint-disable-next-line
      console.error(err);
    }
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
      {!!todosLength && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
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
          onChange={event => {
            setInputValue(event.target.value);
          }}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
