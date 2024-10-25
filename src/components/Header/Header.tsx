import React from 'react';
import cn from 'classnames';

import './Header.scss';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onToggleAll: () => void;
  onSubmit: (ev: FormEvent<Element>) => void;
  query: string;
  setQuery: (q: string) => void;
  isTodoLoading: boolean;
  loadingTodoId: number;
  titleRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  onToggleAll,
  onSubmit,
  query,
  setQuery,
  isTodoLoading,
  loadingTodoId,
  titleRef,
}) => {
  return (
    <header className="header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('header__toggle-all', {
            // only if all todos completed
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleAll()}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={titleRef}
          data-cy="NewTodoField"
          value={query}
          onChange={e => setQuery(e.target.value)}
          type="text"
          className="header__new-todo"
          placeholder="What needs to be done?"
          // disabled on adding or deleting todo
          disabled={isTodoLoading || loadingTodoId !== 0}
        />
      </form>
    </header>
  );
};
