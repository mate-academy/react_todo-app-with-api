import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

type Props = {
  loading: boolean;
  activeTodosCount: number;
  todosExist: boolean;
  title: string;
  post:(e: React.FormEvent<HTMLFormElement>) => void;
  setTitle: (title: string) => void;
  handleToggleAll: () => void
};

export const Form: React.FC<Props> = React.memo(({
  loading,
  activeTodosCount,
  todosExist,
  title,
  post,
  setTitle,
  handleToggleAll,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [loading]);

  return (
    <header className="todoapp__header">
      {todosExist && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !activeTodosCount },
          )}
          aria-label="active_toggle"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={post}>
        <input
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
});
