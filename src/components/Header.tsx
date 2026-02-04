import cn from 'classnames';
import React, { useEffect, useRef } from 'react';

type HeaderProps = {
  activeTodos: number;
  todosQuantity: number;
  isDisabled: boolean;
  query: string;
  focus: number;
  onSubmit: (value: React.FormEvent) => void;
  onSetTitle: (query: string) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  activeTodos,
  todosQuantity,
  isDisabled,
  query,
  focus,
  onSubmit,
  onSetTitle,
  onToggleAll,
}) => {
  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      inputFocus.current?.focus();
    }
  }, [isDisabled, focus]);

  return (
    <header className="todoapp__header">
      {todosQuantity > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: activeTodos === 0 })}
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
          value={query}
          onChange={event => {
            onSetTitle(event.target.value);
          }}
          disabled={isDisabled}
          ref={inputFocus}
        />
      </form>
    </header>
  );
};
