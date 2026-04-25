import React from 'react';
import classNames from 'classnames';

interface Props {
  hasTodos: boolean;
  isCreating: boolean;
  newTitle: string;
  areAllTodosCompleted: boolean;
  newTodoFieldRef: React.RefObject<HTMLInputElement>;
  onCreateTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void;
  onNewTitleChange: (title: string) => void;
}

export const Header: React.FC<Props> = ({
  hasTodos,
  isCreating,
  newTitle,
  areAllTodosCompleted,
  newTodoFieldRef,
  onCreateTodo,
  onToggleAll,
  onNewTitleChange,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areAllTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}

    <form onSubmit={onCreateTodo}>
      <input
        ref={newTodoFieldRef}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        data-cy="NewTodoField"
        value={newTitle}
        disabled={isCreating}
        onChange={event => onNewTitleChange(event.target.value)}
      />
    </form>
  </header>
);
