import React, { useState } from 'react';
import classNames from 'classnames';

type Props = {
  getActiveTodo: boolean;
  disabledInput: boolean;
  onGetCreatTodos: (value: string) => void;
  onCompleteAll: () => void;
};

export const TodoInput: React.FC<Props> = ({
  getActiveTodo,
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
      {getActiveTodo && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            {
              active: !getActiveTodo,
            })}
          aria-label="Mute volume"
          disabled={!getActiveTodo}
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
