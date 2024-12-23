import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ErrorType } from '../../types/ErrorType';
import cn from 'classnames';

type Props = {
  todosLength: number;
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: Dispatch<SetStateAction<ErrorType>>;
  isInputDisabled: boolean;
  isAllCompleted: boolean;
  onToggleAll: () => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement> | null;
};

export const TodoHeader: React.FC<Props> = ({
  todosLength,
  onAddTodo,
  setErrorMessage,
  isInputDisabled,
  isAllCompleted,
  onToggleAll,
  inputRef,
}) => {
  const [inputValue, setInputValue] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setErrorMessage(ErrorType.EmptyTodoTitle);

      return;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (error) {}
  };

  useEffect(() => {
    if (!isInputDisabled) {
      inputRef?.current?.focus();
    }
  }, [todosLength, inputRef, isInputDisabled]);

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(event.target.value)
          }
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
