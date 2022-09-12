import classNames from 'classnames';
import { FC, useEffect, useRef } from 'react';

type Props = {
  query: string,
  setQuery: (str: string) => void,
  isAdding: boolean,
  handleSubmit: () => void,
  toggleAll: () => Promise<void>,
  isToggle: boolean,
};

export const Header: FC<Props> = (props) => {
  const {
    query,
    setQuery,
    isAdding,
    handleSubmit,
    toggleAll,
    isToggle,
  } = props;

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        aria-label="toggle"
        className={classNames('todoapp__toggle-all', { active: isToggle })}
        onClick={toggleAll}
      />

      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={!isAdding}
        />
      </form>
    </header>
  );
};
