import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface PropsHeader {
  todos: Todo[];
  onCreate: (value: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  onTitle: (value: string) => void;
  isCreating: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  allCompleted: boolean;
}

export const Header: React.FC<PropsHeader> = ({
  onCreate,
  todos,
  title,
  onTitle,
  isCreating,
  inputRef,
  onToggleAll,
  allCompleted,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onCreate}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => onTitle(e.target.value)}
          disabled={isCreating}
        />
      </form>
    </header>
  );
};
