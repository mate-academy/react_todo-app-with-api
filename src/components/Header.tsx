import React from 'react';
import cn from 'classnames';

type Props = {
  todoFieldRef: React.RefObject<HTMLInputElement>;
  query: string;
  setQuery: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  disabled: boolean;
  onToggleAll: () => void;
  isAllCompleted: boolean;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  todoFieldRef,
  query,
  setQuery,
  onSubmit,
  disabled,
  onToggleAll,
  isAllCompleted,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
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
          ref={todoFieldRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
