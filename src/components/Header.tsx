import classNames from 'classnames';
import React from 'react';

interface Props {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  isAdding: boolean;
  onSubmit: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  todosLength: number;
  isAllCompleted: boolean;
  onToggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  isAdding,
  onSubmit,
  inputRef,
  todosLength,
  isAllCompleted,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
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
          ref={inputRef}
          value={newTodoTitle}
          disabled={isAdding}
          onChange={e => setNewTodoTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
