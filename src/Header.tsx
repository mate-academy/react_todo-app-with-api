import React from 'react';
import classNames from 'classnames';

interface HeaderProps {
  title: string;
  isAdding: boolean;
  isLoading: boolean;
  hasTodos: boolean;
  allTodosCompleted: boolean;
  canToggleAll: boolean;
  onToggleAll: () => void;
  onTitleChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  isAdding,
  isLoading,
  hasTodos,
  allTodosCompleted,
  canToggleAll,
  onToggleAll,
  onTitleChange,
  onSubmit,
  inputRef,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <header className="todoapp__header">
      {!isLoading && hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
          disabled={!canToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
