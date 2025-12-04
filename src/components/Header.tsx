import React from 'react';
import classNames from 'classnames';

type Props = {
  isLoading: boolean;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSubmit: (event: React.FormEvent) => void;
  allCompleted: boolean;
  onToggleAll: () => void;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  isLoading,
  title,
  setTitle,
  handleSubmit,
  inputRef,
  allCompleted,
  onToggleAll,
  hasTodos,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
        disabled={isLoading}
      />
    )}
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={isLoading}
      />
    </form>
  </header>
);
