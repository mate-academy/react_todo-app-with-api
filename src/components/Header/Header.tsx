import React from 'react';
import cn from 'classnames';

type HeaderProps = {
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  onTodoAdd: (e: React.FormEvent<HTMLFormElement>) => void;
  onToggleCompletedAll: () => void;
  hasTodos: boolean;
  allAreCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  tempTodo: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  newTodoTitle,
  setNewTodoTitle,
  onTodoAdd,
  onToggleCompletedAll,
  hasTodos,
  allAreCompleted,
  inputRef,
  tempTodo,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allAreCompleted })}
        data-cy="ToggleAllButton"
        onClick={onToggleCompletedAll}
      />
    )}

    <form onSubmit={onTodoAdd}>
      <input
        disabled={!!tempTodo}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={newTodoTitle}
        onChange={e => setNewTodoTitle(e.target.value)}
      />
    </form>
  </header>
);
