import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

interface Props {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onToggle: () => void;
  todosCount: number;
  isInputDisabled: boolean;
  activeCount: number;
}

export const Header: React.FC<Props> = ({
  inputValue,
  setInputValue,
  onSubmit,
  onToggle,
  todosCount,
  isInputDisabled,
  activeCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isInputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled, todosCount]);

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeCount === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggle}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          autoFocus
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
