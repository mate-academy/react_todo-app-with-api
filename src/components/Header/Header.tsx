import React, { ChangeEvent, FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  onSubmit: (title:string) => void;
  isDisabled: boolean;
  errorInput: () => void;
  todos: Todo[];
  toogleAll: () => void;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  isDisabled,
  errorInput,
  todos,
  toogleAll,
}) => {
  const [query, setQuery] = useState('');
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query) {
      errorInput();

      return;
    }

    onSubmit(query);
    setQuery('');
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const hidenToggle = todos.length === completedTodos.length;

  return (
    <header className="todoapp__header">
      <button
        aria-label="toogle-all"
        type="button"
        onClick={toogleAll}
        className={classNames(
          'todoapp__toggle-all',
          { active: hidenToggle },
        )}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          value={query}
          onChange={handleInput}
        />
      </form>
    </header>
  );
};
