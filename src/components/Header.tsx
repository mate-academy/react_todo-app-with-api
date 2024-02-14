import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  filtredTodo: Todo[];
  newTodo: string;
  toggleAll: () => void;
  handleNewTodoSubmit: (event: React.FormEvent) => void;
  handleNewTodoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = (
  {
    filtredTodo,
    newTodo,
    toggleAll,
    handleNewTodoSubmit,
    handleNewTodoChange,
  },
) => {
  const completed = filtredTodo.filter(todo => todo.completed).length > 0;

  return (
    <header className="todoapp__header">
      <button
        type="button"
        onClick={toggleAll}
        className={cn('todoapp__toggle-all', {
          active: completed,
        })}
        data-cy="ToggleAllButton"
        aria-label="Toggle all todos"
      />

      <form onSubmit={handleNewTodoSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleNewTodoChange}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          aria-label="New todo"
        />
      </form>
    </header>
  );
};
