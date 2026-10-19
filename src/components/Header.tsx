import React from 'react';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
  allTodosCompleted: boolean;
  newTodoInput: React.RefObject<HTMLInputElement>;
  hasTodos: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  handleSubmit,
  isAdding,
  allTodosCompleted,
  newTodoInput,
  hasTodos,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all
          ${allTodosCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          ref={newTodoInput}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
