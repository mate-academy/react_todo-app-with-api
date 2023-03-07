import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  handleAddTodo: (title: string) => void,
  toggleAllTodos: (todos: Todo[]) => void,
};

export const Header: React.FC<Props> = ({
  todos,
  handleAddTodo,
  toggleAllTodos,
}) => {
  const [query, setQuery] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  const completedTodo = (todos.filter(todo => !todo.completed)).length
    ? todos.filter(todo => !todo.completed)
    : todos;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    handleAddTodo(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.every(todo => todo.completed) },
          { hidden: !todos.length },
        )}
        onClick={() => toggleAllTodos(completedTodo)}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
