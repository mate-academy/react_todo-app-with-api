import React from 'react';

interface Props {
  todosCount: number;
  title: string;
  setTitle: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll?: () => void;
  areAllCompleted?: boolean;
}

export const Header: React.FC<Props> = ({
  todosCount,
  title,
  setTitle,
  onSubmit,
  isSubmitting,
  inputRef,
  onToggleAll,
  areAllCompleted = false,
}) => {
  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
