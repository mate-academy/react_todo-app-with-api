/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';

import { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type HeaderProps = {
  title: string;
  setTitle: (string: string) => void;
  handleSubmit: (event: { preventDefault: () => void }) => void;
  todos: Todo[];
  isLoading: boolean;
  handleToggleButton: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  setTitle,
  handleSubmit,
  todos,
  isLoading,
  handleToggleButton,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: todos.length })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggleButton()}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
