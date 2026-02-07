import React from 'react';
import cn from 'classnames';

type Props = {
  haveTodos: boolean;
  isAllTodosCompleted: boolean;
  isLoading: boolean;
  handleTodoToggleAll: () => void;
  handleCreateTodo: (event: React.FormEvent) => void;
  query: string;
  inputRef: React.RefObject<HTMLInputElement>;
  setQuery: (value: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  haveTodos,
  isAllTodosCompleted,
  isLoading: loading,
  handleTodoToggleAll,
  handleCreateTodo,
  query,
  inputRef,
  setQuery,
}) => {
  return (
    <header className="todoapp__header">
      {haveTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          disabled={loading}
          onClick={() => handleTodoToggleAll()}
        />
      )}

      <form onSubmit={handleCreateTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loading}
        />
      </form>
    </header>
  );
};
