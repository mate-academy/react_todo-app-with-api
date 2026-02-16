import React from 'react';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  hasTodos: boolean;
  allCompleted: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  inputRef,
  isAdding,
  hasTodos,
  allCompleted,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {/* toggle all */}
      {hasTodos && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          onClick={onToggleAll}
        />
      )}

      {/* form */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
