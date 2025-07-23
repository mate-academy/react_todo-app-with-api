import React, { RefObject } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  query: string;
  onTitleChange: (value: string) => void;
  loadingItemIds: number[];
  handleTodosToggle: () => void;
  activeTodosAmount: number;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  todos,
  query,
  onTitleChange,
  loadingItemIds,
  handleTodosToggle,
  activeTodosAmount,
  handleSubmit,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={
            'todoapp__toggle-all' + (activeTodosAmount ? '' : ' active')
          }
          onClick={() => handleTodosToggle()}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={query}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="What needs to be done?"
          disabled={loadingItemIds.length !== 0}
          autoFocus
        />
      </form>
    </header>
  );
};
