import React, { RefObject } from 'react';
import classNames from 'classnames';

type Props = {
  todoValue: string;
  setTodoValue: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent) => void;
  isAdding: boolean;
  allCompleted: boolean;
  handleToggleAll: () => void;
  shouldShowToggleAll: boolean;
  inputRef: RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todoValue,
  setTodoValue,
  handleSubmit,
  isAdding,
  allCompleted,
  handleToggleAll,
  shouldShowToggleAll,
  inputRef,
}) => (
  <header className="todoapp__header">
    {shouldShowToggleAll && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />
    )}

    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={e => setTodoValue(e.target.value)}
        value={todoValue}
        autoFocus
        disabled={isAdding}
        ref={inputRef}
      />
    </form>
  </header>
);
