import React from 'react';
import classNames from 'classnames';

type Props = {
  hasTodos: boolean;
  isToggleAll: boolean;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  hasTodos,
  isToggleAll,
  loading,
  inputRef,
  onToggleAll,
  onSubmit,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isToggleAll,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={inputRef}
        disabled={loading}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  </header>
);
