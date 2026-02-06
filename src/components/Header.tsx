import React, { FormEvent, RefObject, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
  disabled?: boolean;
  onToggleAll: () => void;
  isAllCompleted: boolean;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  onTitleChange,
  title,
  inputRef,
  onSubmit,
  disabled,
  onToggleAll,
  isAllCompleted,
  hasTodos,
}) => {
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, inputRef]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
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
          ref={inputRef}
          onChange={event => onTitleChange(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
