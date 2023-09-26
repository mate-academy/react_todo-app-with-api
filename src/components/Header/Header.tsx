/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useRef } from 'react';

type Props = {
  todoTitle: string,
  onTodoTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
};

export const Header: React.FC<Props> = ({
  todoTitle,
  onTodoTitle,
  onSubmit,

}) => {
  const focusedInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedInput.current) {
      focusedInput.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTodoTitle}
          ref={focusedInput}
        />
      </form>
    </header>
  );
};
