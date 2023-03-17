import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  isActiveTodos: boolean,
  isTodoLoaded: boolean,
  createTodoOnServer: (query: string) => void,
  updateAllTodos: () => void,
  setErrorMessage: (message: string) => void,
  setIsError: (error: boolean) => void,
};

export const Header: React.FC<Props> = ({
  todos,
  isActiveTodos,
  isTodoLoaded,
  createTodoOnServer,
  updateAllTodos,
  setErrorMessage,
  setIsError,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.length) {
      setErrorMessage('Title can\'t be empty');
      setIsError(true);

      return;
    }

    createTodoOnServer(query);
    setQuery('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos?.length !== 0 && (
        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isActiveTodos },
          )}
          onClick={updateAllTodos}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleInputChange}
          disabled={isTodoLoaded}
        />
      </form>
    </header>
  );
};
