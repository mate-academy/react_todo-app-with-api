import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ErrorType } from '../../types/ErrorType';
import cn from 'classnames';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: Dispatch<SetStateAction<ErrorType>>;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => Promise<void>;
  todosLength: number;
  areAllTodosCompleted: boolean;
};

export const TodoHeader: React.FC<Props> = props => {
  const {
    onAddTodo,
    setErrorMessage,
    inputRef,
    onToggleAll,
    todosLength,
    areAllTodosCompleted,
  } = props;

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todosLength, inputRef]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputElement = inputRef.current;

    if (inputValue.trim() === '') {
      setErrorMessage(ErrorType.EmptyTitle);

      return;
    }

    if (inputElement) {
      inputElement.disabled = true;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (error) {
    } finally {
      if (inputElement) {
        inputElement.disabled = false;
        inputElement.focus();
      }
    }
  };

  return (
    <header className="todoapp__header">
      {todosLength !== 0 && (
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
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
