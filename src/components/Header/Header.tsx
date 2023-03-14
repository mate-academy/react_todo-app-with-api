import classNames from 'classnames';

import React from 'react';

type Props = {
  title: string,
  setTitle: (value: string) => void,
  onSubmit: (event: React.FormEvent) => void,
  isDisabled: boolean,
  toggleAll: () => void,
  hasCompletedTodos: boolean,
};

export const Header: React.FC<Props> = React.memo(
  ({
    title,
    setTitle,
    onSubmit,
    isDisabled,
    toggleAll,
    hasCompletedTodos,
  }) => {
    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      if (value !== ' ') {
        setTitle(value);
      }
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: hasCompletedTodos },
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
            onChange={onInputChange}
          />
        </form>
      </header>
    );
  },

);
