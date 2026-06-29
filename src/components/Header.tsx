import React from 'react';
import classNames from 'classnames';

type Props = {
  hasTodos: boolean;
  allCompleted: boolean;
  query: string;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onQueryChange: (value: string) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  hasTodos,
  allCompleted,
  query,
  isSubmitting,
  inputRef,
  onSubmit,
  onQueryChange,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
