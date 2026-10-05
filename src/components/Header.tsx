import React from 'react';

interface Props {
  title: string;
  onChange: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isAllCompleted: boolean;
  hasTodos: boolean;
  onToggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  title,
  onChange,
  onSubmit,
  disabled,
  inputRef,
  isAllCompleted,
  hasTodos,
  onToggleAll,
}) => {
  const toggleAllClass = `todoapp__toggle-all ${
    isAllCompleted ? 'active' : ''
  }`;

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={toggleAllClass}
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
          value={title}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
