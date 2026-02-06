import React, { LegacyRef } from 'react';
import cn from 'classnames';

type Props = {
  todoField?: LegacyRef<HTMLInputElement>;
  query: string;
  isActive: boolean;
  isVisible: boolean;
  onToggleAll: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setQuery: (e: string) => void;
};

export const AddBar: React.FC<Props> = ({
  todoField,
  query,
  isActive,
  isVisible,
  onSubmit,
  onToggleAll,
  setQuery,
}) => {
  return (
    <header className="todoapp__header">
      {isVisible && (
        <button
          type="button"
          className={cn(`todoapp__toggle-all`, { active: isActive })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={todoField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </form>
    </header>
  );
};
