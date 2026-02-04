import * as React from 'react';
import cn from 'classnames';
import { Todo } from './../types/Todo';

interface Props {
  todos: Todo[];
  query: string;
  setQuery: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  completedCount: number;
  onToggleAll: () => void;
}

const HeaderComponent: React.FC<Props> = ({
  todos,
  query,
  setQuery,
  onSubmit,
  isSubmitting,
  inputRef,
  completedCount,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: completedCount === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};

export const Header = React.memo(HeaderComponent);
