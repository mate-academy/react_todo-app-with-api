import classNames from 'classnames';
import { FC, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  query: string,
  setQuery: (str: string) => void,
  isAdding: boolean,
  handleSubmit: () => void,
  toggleAll: () => Promise<void>,
  isCompletedAll: boolean,
  visibleTodos: Todo[],
};

export const Header: FC<Props> = (props) => {
  const {
    query,
    setQuery,
    isAdding,
    handleSubmit,
    toggleAll,
    isCompletedAll,
    visibleTodos,
  } = props;

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {visibleTodos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          aria-label="toggle"
          className={
            classNames('todoapp__toggle-all', { active: isCompletedAll })
          }
          onClick={toggleAll}
        />
      )}

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
