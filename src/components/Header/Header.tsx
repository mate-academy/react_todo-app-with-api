import React from 'react';

type Props = {
  newTitle: string;
  setNewTitle: (title: string) => void;
  onAdd: (event: React.FormEvent) => void;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  hasTodos: boolean; // if 1 todo
  allCompleted: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onAdd,
  disabled,
  inputRef,
  hasTodos,
  allCompleted,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={`todoapp__toggle-all${allCompleted ? ' active' : ''}`}
          onClick={onToggleAll}
        />
      )}
      <form onSubmit={onAdd}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          autoFocus
          disabled={disabled}
        />
      </form>
    </header>
  );
};
