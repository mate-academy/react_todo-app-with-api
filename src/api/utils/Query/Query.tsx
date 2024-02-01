import classNames from 'classnames';
import React, { useContext, useEffect, useRef } from 'react';

import { TodosContext } from '../TodoContext';

export const Query:React.FC = () => {
  const {
    todos,
    isDisabled,
    query,
    setQuery,
    filteredTodos,
    handleError,
    onSubmit,
    completeAll,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const numberOfCompleted = filteredTodos.filter(
    (item) => item.completed,
  ).length;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      handleError('Title should not be empty');
      setQuery('');
    } else {
      onSubmit(query.trim());
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled, todos.length]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        /* eslint-disable jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: numberOfCompleted === todos.length },
          )}
          data-cy="ToggleAllButton"
          onClick={() => completeAll()}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={query}
          disabled={isDisabled}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
