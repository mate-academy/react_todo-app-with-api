import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  onSubmit: (title: string) => Promise<void>,
  loaded: boolean,
  onUpdateTodoAll: () => void,
}

export const Header: React.FC<Props> = React.memo(
  ({
    todos,
    onSubmit,
    loaded,
    onUpdateTodoAll,
  }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      onSubmit(query);
      setQuery('');
    };

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setQuery(value);
    };

    return (
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              {
                active: todos.some(todo => todo.completed),
              },
            )}
            aria-label="toggle-button"
            onClick={onUpdateTodoAll}
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={query}
            onChange={handleChangeInput}
            disabled={loaded}
          />
        </form>
      </header>
    );
  },
);
