import React, { useState, useContext } from 'react';

import { Context } from '../../Context';
import { ErrorMessage } from '../../types/ErrorMessage';

export const Header = () => {
  const [query, setQuery] = useState('');
  const {
    handleErrorChange,
    handleActiveTodos,
    handleAddTodo,
  } = useContext(Context);

  const handleQueryChange = (value: string) => {
    handleErrorChange('');
    setQuery(value);
  };

  const addingTodo = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      handleErrorChange(ErrorMessage.EMPTY_TITLE);
      setQuery('');

      return;
    }

    handleAddTodo(query.trim());
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {handleActiveTodos > 0 && (
        /*  eslint-disable-next-line jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          onClick={() => handleErrorChange(ErrorMessage.UNABLE_TO_UPDATE)}
        />
      )}

      <form onSubmit={addingTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
        />
      </form>
    </header>
  );
};
