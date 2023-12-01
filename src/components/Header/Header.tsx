import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type HeaderProps = {
  title: string;
  setTitle: (string: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  todos: Todo[];
  isLoading: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  setTitle,
  handleSubmit,
  todos,
  isLoading,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    {todos.length > 0 && (
      <button
        type="button"
        className={cn('todoapp__toggle-all',
          { active: todos.every(todo => todo.completed) })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
        aria-label="toggle-all button"
      />
    )}
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        disabled={isLoading}
        ref={(input) => input && input.focus()}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </form>
  </header>
);
