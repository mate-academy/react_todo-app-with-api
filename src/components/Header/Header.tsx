/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef } from 'react';
import cn from 'classnames';
import { useTodoContext } from '../../context/TodosProvider';

export const Header:React.FC = () => {
  const {
    query, handleSubmitSent, setQuery, filteredTodos, handleToggleAll, pending,
  } = useTodoContext();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const toggledButtonActive = filteredTodos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {filteredTodos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: toggledButtonActive })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={(event) => handleSubmitSent(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          disabled={!!pending}
          onChange={(event) => setQuery(event.target.value)}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
