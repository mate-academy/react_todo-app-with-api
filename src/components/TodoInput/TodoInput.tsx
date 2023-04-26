import React, { useState } from 'react';
import classNames from 'classnames';

type Props = {
  onCreateTodos: boolean;
  disabledInput: boolean;
  onGetCreatTodos: (value: string) => void;
  onCompleteAll: () => void;
};

export const TodoInput: React.FC<Props> = ({
  onCreateTodos,
  disabledInput,
  onGetCreatTodos,
  onCompleteAll,
}) => {
  const [query, setQuery] = useState('');

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGetCreatTodos(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {onCreateTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            {
              active: !onCreateTodos,
            })}
          aria-label="Toggle all todos"
          disabled={!onCreateTodos}
          onClick={onCompleteAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={disabledInput}
        />
      </form>
    </header>
  );
};
