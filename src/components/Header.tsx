/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useState } from 'react';

type Props = {
  allCompleted: boolean,
  onAdd: (title: string) => Promise<void>,
  onToggleAll: () => void,
};

export const Header: React.FC<Props> = ({
  onAdd,
  onToggleAll,
  allCompleted,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      return;
    }

    onAdd(title)
      .then(() => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        onClick={onToggleAll}

      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
