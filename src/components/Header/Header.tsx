import React from 'react';
import cn from 'classnames';

interface Props {
  onSubmit: (arg: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAdding: boolean;
  isAllCompleted: boolean;
  onToggleAll: () => void;
  hasTodos: boolean;
}

export const Header = React.memo(
  React.forwardRef<HTMLInputElement, Props>(
    (
      {
        onSubmit,
        title,
        setTitle,
        isAdding,
        isAllCompleted,
        onToggleAll,
        hasTodos,
      },
      ref,
    ) => {
      return (
        <header className="todoapp__header">
          {hasTodos && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', { active: isAllCompleted })}
              data-cy="ToggleAllButton"
              onClick={onToggleAll}
            />
          )}

          <form onSubmit={onSubmit}>
            <input
              name="newTodoField"
              value={title}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={setTitle}
              disabled={isAdding}
              ref={ref}
            />
          </form>
        </header>
      );
    },
  ),
);

Header.displayName = 'Header';
