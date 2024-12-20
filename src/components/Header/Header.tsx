import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  value: string;
  isInputDisabled: boolean;
  allCompleted: boolean;
  todos: Todo[];
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onSubmit: (event: React.FormEvent) => void;
  setValue: (str: string) => void;
  toogleAll: () => void;
}

export const Header: React.FC<Props> = React.memo(
  ({
    value,
    isInputDisabled,
    allCompleted,
    todos,
    inputRef,
    onSubmit,
    setValue,
    toogleAll,
  }) => {
    return (
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={toogleAll}
          />
        )}

        <form onSubmit={onSubmit}>
          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={value}
            onChange={event => setValue(event.target.value)}
            disabled={isInputDisabled}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
