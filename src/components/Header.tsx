import React from 'react';
import classNames from 'classnames';

type Props = {
  hasTodos: boolean;
  allTodosCompleted: boolean;
  newTodoTitle: string;
  isCreating: boolean;
  onNewTodoTitleChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  hasTodos,
  allTodosCompleted,
  newTodoTitle,
  isCreating,
  onNewTodoTitleChange,
  onSubmit,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        >
          <span className="is-sr-only">Toggle all</span>
        </button>
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => onNewTodoTitleChange(event.target.value)}
          disabled={isCreating}
        />
      </form>
    </header>
  );
};
