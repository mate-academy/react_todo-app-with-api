import React, { FormEvent, RefObject } from 'react';
import cn from 'classnames';

interface HeaderProps {
  isAllCompleted: boolean;
  newTodoTitle: string;
  inputRef: RefObject<HTMLInputElement>;
  onSubmit: (event: FormEvent) => void;
  onSetNewTodoTitle: (title: string) => void;
  isAdding: boolean;
  onToggleAll: () => Promise<void>;
  isLoading: boolean;
  hasTodos: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isAllCompleted,
  newTodoTitle,
  inputRef,
  onSubmit,
  onSetNewTodoTitle,
  isAdding,
  onToggleAll,
  isLoading,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && !isLoading && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted === true,
          })}
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
          value={newTodoTitle}
          onChange={event => onSetNewTodoTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
