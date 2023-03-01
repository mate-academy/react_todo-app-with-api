import React from 'react';
import classNames from 'classnames';

type Props = {
  isAllCompleted: boolean;
  onToogleAllTodos: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string
  onEventChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = ({
  isAllCompleted,
  onToogleAllTodos,
  onSubmit,
  title,
  onEventChange,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="button"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isAllCompleted },
        )}
        onClick={onToogleAllTodos}
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onEventChange}
        />
      </form>
    </header>
  );
};
