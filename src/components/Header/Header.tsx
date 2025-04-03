import React from 'react';
import cn from 'classnames';

type Props = {
  notCompletedTodosCount: number;
  addTodo: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
  isInputDisabled: boolean;
  toggleAllTodos: () => void;
  isTodosEmpty: number;
};

export const Header: React.FC<Props> = ({
  notCompletedTodosCount,
  addTodo,
  inputRef,
  inputValue,
  setInputValue,
  isInputDisabled,
  toggleAllTodos,
  isTodosEmpty,
}) => {
  const handleChanges = (event: React.FormEvent) => {
    event.preventDefault();
    addTodo(inputValue);
  };

  return (
    <header className="todoapp__header">
      {isTodosEmpty > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: notCompletedTodosCount === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleAllTodos()}
        />
      )}

      <form onSubmit={handleChanges}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
