import React, { forwardRef } from 'react';
import cn from 'classnames';

type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isToggleAllActive: boolean;
  isLoading: boolean;
  onToggleAll: () => void;
  hasTodos: boolean;
};

export const Header = forwardRef<HTMLInputElement, Props>(
  (
    {
      title,
      onTitleChange,
      onSubmit,
      isToggleAllActive,
      isLoading,
      onToggleAll,
      hasTodos,
    },
    ref,
  ) => (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isToggleAllActive,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={ref}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => onTitleChange(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  ),
);

Header.displayName = 'Header';
