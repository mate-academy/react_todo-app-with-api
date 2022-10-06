import classNames from 'classnames';
import React, { FormEventHandler, RefObject } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>,
  title: string,
  setTitle: (param: string) => void,
  handleTodos: FormEventHandler<HTMLFormElement>;
  toggleAll: boolean,
  handleToggleAll: () => void,
};

export const Header: React.FC<Props> = ({
  newTodoField,
  title,
  setTitle,
  handleTodos,
  toggleAll,
  handleToggleAll,
}) => {
  const getValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="a problem"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: toggleAll },
        )}
        onClick={handleToggleAll}
      />

      <form onSubmit={handleTodos}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={getValue}
        />
      </form>
    </header>
  );
};
