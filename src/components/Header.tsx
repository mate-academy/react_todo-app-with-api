/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

type Props = {
  newTitle: string,
  setNewTitle: (newTitle: string) => void,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  completed: boolean,
  handleToggle: () => void,
};

export const Header: React.FC<Props> = ({
  handleToggle,
  newTitle,
  setNewTitle,
  onSubmit,
  completed,
}) => {
  return (
    <header className="todoapp__header">

      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: completed,
        })}
        onClick={() => handleToggle()}
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
      </form>
    </header>

  );
};
