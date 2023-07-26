import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  addTodo: (todo: string) => void,
  updateTodo: (uTodo: Todo) => void,
};

export const Header: React.FC<Props> = ({ todos, addTodo, updateTodo }) => {
  const isSomeActive = todos.some(todo => !todo.completed);

  const [value, setValue] = useState('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(value);
    setValue('');
  };

  const handleCompleteAll = (e: React.MouseEvent) => {
    e.preventDefault();
    const activeTodos = todos.filter(todo => !todo.completed);

    if (isSomeActive) {
      activeTodos.forEach(todo => {
        const updatedTodo = { ...todo, completed: !todo.completed };

        updateTodo(updatedTodo);
      });
    } else {
      todos.forEach(todo => {
        const updatedTodo = { ...todo, completed: !todo.completed };

        updateTodo(updatedTodo);
      });
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          aria-label="button"
          className={classNames('todoapp__toggle-all',
            isSomeActive ? '' : 'active')}
          onClick={handleCompleteAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
    </header>
  );
};
