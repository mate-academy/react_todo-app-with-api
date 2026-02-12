import React, { RefObject } from 'react';
import cn from 'classnames';

interface Props {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
  onToggleAll: () => void;
  isAllCompleted: boolean;
  hasTodos: boolean;
}

export const Header: React.FC<Props> = ({
  title,
  onTitleChange,
  onSubmit,
  inputRef,
  disabled,
  onToggleAll,
  isAllCompleted,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      <form onSubmit={onSubmit}>
        {hasTodos && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: isAllCompleted })}
            data-cy="ToggleAllButton"
            onClick={onToggleAll}
          ></button>
        )}
        <input
          ref={inputRef}
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabled}
        />
      </form>
    </header>
  );
};
