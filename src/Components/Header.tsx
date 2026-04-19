import React from 'react';
import classNames from 'classnames';

type Props = {
  newTodoText: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  newTodoRef: React.RefObject<HTMLInputElement>;
  isDisabled: boolean;
  hasTodos: boolean;
  allCompleted: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  newTodoText,
  onChange,
  onSubmit,
  newTodoRef,
  isDisabled,
  hasTodos,
  allCompleted,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        ref={newTodoRef}
        value={newTodoText}
        onChange={e => onChange(e.target.value)}
        disabled={isDisabled}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  </header>
);
