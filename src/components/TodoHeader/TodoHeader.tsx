import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  countOfTodos: number;
  countOfCompletedTodos: number;
  isInputDisabled: boolean;
  onAddTodo: (title: string) => Promise<void>;
  setErrorMessage: (error: Errors) => void;
  updateAllTodosCompletion: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  countOfTodos,
  countOfCompletedTodos,
  isInputDisabled,
  onAddTodo,
  setErrorMessage,
  updateAllTodosCompletion,
}) => {
  const [inputText, setInputText] = useState('');
  const isAllTodosCompleted = useMemo(
    () => countOfCompletedTodos === countOfTodos,
    [countOfCompletedTodos, countOfTodos],
  );
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await onAddTodo(inputText);
      setInputText('');
    } catch (error) {
      if (Object.values(Errors).includes(error as Errors)) {
        setErrorMessage(error as Errors);
      } else {
        setErrorMessage(Errors.unknownError);
      }
    }
  }

  useEffect(() => {
    if (inputRef.current && !isInputDisabled) {
      inputRef.current.focus();
    }
  }, [countOfTodos, isInputDisabled]);

  return (
    <header className="todoapp__header">
      {countOfTodos !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={updateAllTodosCompletion}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={event => setInputText(event.target.value)}
          disabled={isInputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
