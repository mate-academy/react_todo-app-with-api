import React, { useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  isInputDisabled: boolean;
  isToggleAllActive: boolean;
  hasTodos: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleAll: () => void;
  focusTrigger: number;
}

export const Header: React.FC<Props> = ({
  inputRef,
  inputValue,
  isInputDisabled,
  isToggleAllActive,
  hasTodos,
  onInputChange,
  onSubmit,
  onToggleAll,
  focusTrigger,
}) => {
  useEffect(() => {
    if (inputRef.current && !isInputDisabled) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTrigger]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isToggleAllActive,
          })}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          disabled={isInputDisabled}
          onChange={e => onInputChange(e.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};
