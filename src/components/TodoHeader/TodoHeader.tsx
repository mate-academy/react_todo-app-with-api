import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  countOfTodos: number;
  countOfCompletedTodos: number;
  isInputDisabled: boolean;
  fetchAddTodo: (title: string) => Promise<boolean>;
  setErrorMessage: (error: Errors) => void;
  UpdateAllTodosCompleted: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  countOfTodos,
  countOfCompletedTodos,
  isInputDisabled,
  fetchAddTodo,
  setErrorMessage,
  UpdateAllTodosCompleted,
}) => {
  const [inputText, setInputText] = useState('');
  const isAllTodosCompleted = countOfCompletedTodos === countOfTodos;
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (inputText.trim()) {
      if (await fetchAddTodo(inputText.trim())) {
        setInputText('');
      }
    } else {
      setErrorMessage(Errors.emptyTitleError);
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
          onClick={() => UpdateAllTodosCompleted()}
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
