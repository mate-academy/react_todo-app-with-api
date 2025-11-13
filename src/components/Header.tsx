import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

type Props = {
  newTodoTitle: string;
  onNewTodoChange: (title: string) => void;
  isAppBusy: boolean;
  onTodoAdd: (event: React.FormEvent) => void;
  allCompleted: boolean;
  onToggleAll: () => void;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  onNewTodoChange,
  isAppBusy,
  onTodoAdd,
  allCompleted,
  onToggleAll,
  hasTodos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isAppBusy) {
      inputRef.current.focus();
    }
  }, [isAppBusy]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onTodoAdd}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => onNewTodoChange(e.target.value)}
          disabled={isAppBusy}
        />
      </form>
    </header>
  );
};
