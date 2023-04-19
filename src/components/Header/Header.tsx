import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  hasActiveTodos: boolean;
  onTodoAdd: (title: string) => void;
  isTodoAdding: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = React.memo(({
  hasActiveTodos,
  onTodoAdd,
  isTodoAdding,
  onToggleAll,
}) => {
  const [query, setQuery] = useState('');
  const [shouldFocus, setShouldFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!shouldFocus) {
      setShouldFocus(true);
    }

    if (inputRef.current !== null && shouldFocus) {
      inputRef.current.focus();
    }
  }, [isTodoAdding]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onTodoAdd(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="all-active"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !hasActiveTodos },
        )}
        onClick={onToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
});
