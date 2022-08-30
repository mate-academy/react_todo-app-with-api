/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  query: string,
  setQuery: (v:string) => void,
}

export const TodoHeader: React.FC<Props> = (props) => {
  const { newTodoField, query, setQuery } = props;

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </header>
  );
};
