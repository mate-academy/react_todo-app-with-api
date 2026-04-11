/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';

type Props = {
  newTitle: string;
  setNewTitle: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleAll: () => void;
  allCompleted: boolean;
  isLoading: boolean;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  onToggleAll,
  allCompleted,
  isLoading,
  hasTodos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <header className="todoapp__header">
      {/* ToggleAll ONLY if todos exist AND not loading */}
      {hasTodos && !isLoading && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={newTitle}
          autoFocus
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          onChange={e => setNewTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
