import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onInputChange: (newTitle: string) => void,
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  isInputFieldDisabled: boolean,
  onHandleChangeCompleted: () => void,
};

export const Header: React.FC<Props> = ({
  todos,
  onInputChange,
  inputValue,
  setInputValue,
  isInputFieldDisabled,
  onHandleChangeCompleted,
}) => {
  const activeTodos = todos?.length
    ? todos.every((todo) => todo.completed)
    : false;

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const inputRef = useRef(null);

  const setInputFocus = () => {
    if (!isInputFieldDisabled && inputRef?.current) {
      const input: HTMLInputElement = inputRef.current;

      input.focus();
    }
  };

  useEffect(() => {
    setInputFocus();
  }, [inputValue, isInputFieldDisabled, todos]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onInputChange(inputValue);
  };

  const handleChangeAllCompleted = () => {
    onHandleChangeCompleted();
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          aria-label="toggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: activeTodos },
          )}
          data-cy="ToggleAllButton"
          onClick={handleChangeAllCompleted}
        />
      )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          ref={inputRef}
          disabled={isInputFieldDisabled}
          value={inputValue}
          onChange={handleTitleChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
