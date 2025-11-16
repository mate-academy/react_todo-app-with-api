import React, { FormEvent, RefObject } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[] | null;
  countOfTodos: number;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  value: string;
  setValue: (value: string) => void;
  waiting: boolean;
  inputRef: RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
  waitForToggle: boolean;
};

export const Header: React.FC<Props> = ({
  countOfTodos,
  handleSubmit,
  value,
  setValue,
  waiting,
  inputRef,
  handleToggleAll,
  waitForToggle,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {(todos ?? []).length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: countOfTodos === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          disabled={waitForToggle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={value}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setValue(event.target.value)}
          disabled={waiting}
        />
      </form>
    </header>
  );
};
