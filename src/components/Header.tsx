/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import {
  FC, memo, useRef, useEffect,
} from 'react';

interface Props {
  todosLength: number;
  handleFormSubmit: () => void;
  query: string | number;
  setQuery: (event: string) => void;
  uncompletedTodos: number;
  toggleAll: () => void;
  isPageLoaded: boolean;
}

export const Header: FC<Props> = memo(({
  todosLength,
  handleFormSubmit,
  query,
  setQuery,
  uncompletedTodos,
  toggleAll,
  isPageLoaded,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef, isPageLoaded, uncompletedTodos, todosLength]);

  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !uncompletedTodos },
          )}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!isPageLoaded}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
      </form>
    </header>
  );
});
