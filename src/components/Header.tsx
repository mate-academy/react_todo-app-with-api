import React from 'react';
import classNames from 'classnames';

interface Props {
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  // #UPDATE: Przywracamy propsy dla "Toggle All"
  isToggleAllVisible: boolean;
  areAllCompleted: boolean;
  onToggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  title,
  onTitleChange,
  onSubmit,
  inputRef,
  isAdding,
  isToggleAllVisible,
  areAllCompleted,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {/* #UPDATE: Przywracamy przycisk "Toggle All" */}
      {isToggleAllVisible && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
          aria-label="Toggle all todos"
        />
      )}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
