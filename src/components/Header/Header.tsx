import React from 'react';

type Props = {
  isLoading: boolean;
  todosLength: number;
  allCompleted: boolean;
  loading: boolean;
  newTitle: string;
  tempTodoExists: boolean;

  onToggleAll: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChangeTitle: (value: string) => void;

  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  isLoading,
  todosLength,
  allCompleted,
  loading,
  newTitle,
  tempTodoExists,
  onToggleAll,
  onSubmit,
  onChangeTitle,
  inputRef,
}) => (
  <header className="todoapp__header">
    {/* this button should have `active` class only if all todos are completed */}
    {!isLoading && todosLength > 0 && (
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
        disabled={loading}
      />
    )}

    {/* Add a todo on form submit */}
    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTitle}
        disabled={tempTodoExists}
        onChange={event => onChangeTitle(event.target.value)}
        autoFocus
      />
    </form>
  </header>
);
