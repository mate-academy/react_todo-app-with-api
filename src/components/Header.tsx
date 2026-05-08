import React from 'react';

type Props = {
  newTitle: string;
  setNewTitle: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  allCompleted: boolean;
  hasTodos: boolean;
  onToggleAll?: () => void;
};

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  isAdding,
  inputRef,
  allCompleted,
  hasTodos,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
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
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
