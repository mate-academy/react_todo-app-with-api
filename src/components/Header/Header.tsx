import classNames from 'classnames';
import React, { FC, RefObject } from 'react';

export interface Props {
  newTodoField: (RefObject<HTMLInputElement>),
  title: string,
  onSetTitle: (value: string) => void,
  isAdding: boolean,
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  isAllTodosCompleted: boolean,
  toggleAll: () => void,
}

export const Header: FC<Props> = ({
  newTodoField,
  title,
  onSetTitle: setTitle,
  isAdding,
  onFormSubmit,
  isAllTodosCompleted,
  toggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        onClick={toggleAll}
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all', {
            active: isAllTodosCompleted,
          },
        )}
      />

      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
