import React from 'react';

interface Props {
  title: string;
  setTitle: (val: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  todosCount: number;
  activeTodosCount: number;
  handleToggleAll: () => void;
}

export const TodoHeader: React.FC<Props> = ({
  title,
  setTitle,
  handleSubmit,
  disabled = false,
  inputRef,
  todosCount,
  activeTodosCount,
  handleToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${activeTodosCount === 0 ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={disabled}
          autoFocus
        />
      </form>
    </header>
  );
};
