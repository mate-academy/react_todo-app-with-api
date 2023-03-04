import classNames from 'classnames';

import React from 'react';

type Props = {
  title: string,
  setTitle: (value: string) => void,
  onSubmit: (event: React.FormEvent) => void,
  isDisabled: boolean,
  toggleAll: () => void,
  noCompletedTodos: boolean,
};

export const Header: React.FC<Props> = React.memo(
  ({
    title,
    setTitle,
    onSubmit,
    isDisabled,
    toggleAll,
    noCompletedTodos,
  }) => {
    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: noCompletedTodos },
          )}
          onClick={toggleAll}
        />

        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            disabled={isDisabled}
            value={title}
            onChange={(event) => {
              if (event.target.value !== ' ') {
                setTitle(event.target.value);
              }
            }}
          />
        </form>
      </header>
    );
  },

);
