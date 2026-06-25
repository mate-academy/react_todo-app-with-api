import React from 'react';

interface Props {
  isDisabled: boolean;
  inputText: string;
  setInputText: (text: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  allCompleted: boolean;
  hasTodos: boolean;
}

export const Header: React.FC<Props> = ({
  isDisabled,
  inputText,
  setInputText,
  onSubmit,
  inputRef,
  onToggleAll,
  allCompleted,
  hasTodos,
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
          value={inputText}
          onChange={event => setInputText(event.target.value)}
          disabled={isDisabled}
          ref={inputRef}
          autoFocus={true}
        />
      </form>
    </header>
  );
};
