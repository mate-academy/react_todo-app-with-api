import cn from 'classnames';

import { NewTodoForm } from '../NewTodoForm';

import type { Todo } from '../../types/Todo';
import type { FormEvent, RefObject } from 'react';

type Props = {
  todos: Todo[];
  completedTodos: Todo[];
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  query: string;
  onQueryChange: (newQuery: string) => void;
  isLoading: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onToggleAll: () => void;
};

export const Header = ({
  todos,
  completedTodos,
  onFormSubmit,
  query,
  onQueryChange,
  isLoading,
  inputRef,
  onToggleAll,
}: Props) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.length === completedTodos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <NewTodoForm
        onFormSubmit={onFormSubmit}
        query={query}
        onQueryChange={onQueryChange}
        isLoading={isLoading}
        inputRef={inputRef}
      />
    </header>
  );
};
