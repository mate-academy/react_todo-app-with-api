import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  addTodo: (value: string) => void,
  isLoading: boolean,
  setToggleAllTodos: () => void
};

export const Header: React.FC<Props> = ({
  todos, addTodo, isLoading, setToggleAllTodos,
}) => {
  const [value, setValue] = useState('');

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(value);
    setValue('');
  };

  const toggleAllTodos = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setToggleAllTodos();
  };

  const someCompleted = useMemo(() => todos
    .some(todo => !todo.completed), [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: someCompleted },
        )}
        onClick={toggleAllTodos}
        aria-label="toggleButton"
      />

      <form onSubmit={formSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
