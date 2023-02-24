import cn from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setErrorMessage: (message: string) => void,
  createTodoOnServer: (query: string) => void,
  updateAllTodos:() => void,
  isTodosLoaded: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  setErrorMessage,
  updateAllTodos,
  createTodoOnServer: postTodoToServer,
  isTodosLoaded,
}) => {
  const isAllTodoActive = todos.every((todo) => todo.completed === true);
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (query.length === 0) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    postTodoToServer(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {Boolean(todos.length)
      && (
        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: isAllTodoActive },
          )}
          onClick={() => updateAllTodos()}
        />
      )}
      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={!isTodosLoaded}
        />
      </form>
    </header>
  );
};
