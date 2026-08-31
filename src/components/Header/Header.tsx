/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  allTodosCompleted: boolean;
  onToggleAll: () => void;
  showToggleAll: boolean;
};

export const Header: React.FC<Props> = ({
  inputRef,
  onSubmit,
  value,
  onChange,
  disabled,
  allTodosCompleted,
  onToggleAll,
  showToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {showToggleAll && (
        <button
          type="button"
          className={`todoapp__toggle-all ${
            allTodosCompleted ? 'active' : ''
          }`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={event => onChange(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
