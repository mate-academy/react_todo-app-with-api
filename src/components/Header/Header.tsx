import cn from 'classnames';
import React from 'react';
import { useEffect, useRef } from 'react';

type Props = {
  areAllCompleted: boolean;
  isProcessing: boolean;
  isAdding: boolean;
  query: string;
  emptyTodos: boolean;
  onQueryChange?: (newQuery: string) => void;
  onNewTodo?: (title: string) => void;
  onCompleteToggle?: (areAllCompleted: boolean) => void;
};

export const Header: React.FC<Props> = ({
  areAllCompleted,
  isAdding,
  isProcessing,
  query,
  emptyTodos,
  onQueryChange = () => {},
  onNewTodo = () => {},
  onCompleteToggle = () => {},
}) => {
  const inputElement = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onNewTodo(query.trim());
  };

  useEffect(() => {
    if (isProcessing) {
      inputElement.current?.blur();
    } else {
      inputElement.current?.focus();
    }
  }, [isProcessing]);

  return (
    <header className="todoapp__header">
      {!emptyTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: areAllCompleted })}
          data-cy="ToggleAllButton"
          onClick={() => onCompleteToggle(areAllCompleted)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputElement}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
