/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

interface Props {
  activeTodosCount: number;
  inputValue: string;
  inputDisabled: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleAllTodos: () => void;
}

export const Header: React.FC<Props> = ({
  activeTodosCount,
  inputValue,
  inputDisabled,
  onInputChange,
  onSubmit,
  onToggleAllTodos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeTodosCount]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: activeTodosCount === 0,
        })}
        onClick={onToggleAllTodos}
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={onInputChange}
          disabled={inputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
