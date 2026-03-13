import React from 'react';
import classNames from 'classnames';

interface Props {
  newTitle: string;
  setNewTitle: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAdding: boolean;
  todosCount: number;
  activeCount: number;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  isAdding,
  todosCount,
  activeCount,
  inputRef,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    <h1 className="todoapp__title">todos</h1>

    {todosCount > 0 && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: activeCount === 0,
        })}
        onClick={onToggleAll}
        data-cy="ToggleAllButton"
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        disabled={isAdding}
      />
    </form>
  </header>
);
