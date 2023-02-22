import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

type Props = {
  isAdding: boolean;
  todosLength: number;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (newTitle: string) => void;
  onToggle: () => void;
  completedTodos: number;
};

export const Header: React.FC<Props> = React.memo(({
  isAdding,
  todosLength,
  onSubmit,
  title,
  setTitle,
  onToggle,
  completedTodos,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          aria-label="ToggleAllButton"
          className={classNames('todoapp__toggle-all', {
            active: todosLength === completedTodos,
          })}
          onClick={onToggle}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
