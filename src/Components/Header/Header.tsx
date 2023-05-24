/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, memo, useCallback } from 'react';
import classNames from 'classnames';

interface Props {
  isTodosNoEmpty: boolean;
  isEveryTotoCompleted: boolean;
  onUpdateAllTodos: () => Promise<void>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const Header: FC<Props> = memo(({
  isTodosNoEmpty,
  isEveryTotoCompleted,
  onUpdateAllTodos,
  onSubmit,
  query,
  setQuery,
}) => {
  const handleSubmit = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    onSubmit(event);
  }, [onSubmit]);

  const handleUpdateAllTodos = useCallback(() => {
    onUpdateAllTodos();
  }, [onUpdateAllTodos]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return (
    <header className="todoapp__header">
      {isTodosNoEmpty && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all', {
              active: isEveryTotoCompleted,
            },
          )}
          onClick={handleUpdateAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
        />
      </form>
    </header>
  );
});
