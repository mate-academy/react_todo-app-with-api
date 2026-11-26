import React from 'react';
import classNames from 'classnames';

type Props = {
  showToggle: boolean;
  allCompleted: boolean;
  isTogglingDisabled: boolean;
  onToggleAll: () => void;
  newTitle: string;
  isAdding: boolean;
  onChangeTitle: (v: string) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  showToggle,
  allCompleted,
  isTogglingDisabled,
  onToggleAll,
  newTitle,
  isAdding,
  onChangeTitle,
  onSubmit,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {showToggle && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle all todos"
          aria-pressed={allCompleted}
          disabled={isTogglingDisabled}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          aria-label="New todo"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => onChangeTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};

export default Header;
