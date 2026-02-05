import React from 'react';
import cn from 'classnames';

type Props = {
  activeTodo: boolean;
  title: string;
  setTitle: (value: string) => void;
  inputField: React.RefObject<HTMLInputElement>;
  loading: boolean;
  onTodoAdd: (event: React.FormEvent) => void;
  toggleAll?: () => void;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  activeTodo,
  title,
  setTitle,
  inputField,
  loading,
  onTodoAdd: handleSubmit,
  toggleAll: handleToggleAll,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: activeTodo })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
