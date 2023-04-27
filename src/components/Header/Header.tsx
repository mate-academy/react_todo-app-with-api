import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';

type Props = {
  createTodo: (title: string) => void,
  isDisableInput: boolean,
  toggleAllTodos: () => void,
  isAllCompleted: boolean,
};

export const Header: React.FC<Props> = ({
  createTodo,
  isDisableInput,
  toggleAllTodos,
  isAllCompleted,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    createTodo(query);
    setQuery('');
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        aria-label="Toggle all todos"
        onClick={toggleAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={onInputChange}
          disabled={isDisableInput}
        />
      </form>
    </header>
  );
};
