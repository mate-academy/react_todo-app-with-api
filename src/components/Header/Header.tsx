import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  title: string
  setTitle: (newTitle: string) => void
  onSaveNewTodo: () => void,
  tempTodo: Todo | null,
  onToggleAll: () => void,
  isAllCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  onSaveNewTodo,
  tempTodo,
  onToggleAll,
  isAllCompleted,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSaveNewTodo();
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: isAllCompleted,
          },
        )}
        onClick={onToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
