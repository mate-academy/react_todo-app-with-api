/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

type Props = {
  query: string,
  onChangeQuery: (event: React.FormEvent<HTMLInputElement>) => void,
  addTodo: (event: React.KeyboardEvent<HTMLFormElement>) => void,
  loading: boolean,
  toggleAll: (event: React.MouseEvent) => void,
  itemsLeft: number,
};

export const Header: React.FC<Props> = ({
  query,
  onChangeQuery,
  addTodo,
  loading,
  toggleAll,
  itemsLeft,
}) => {
  return (
    <header className="todoapp__header">

      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: itemsLeft === 0,
        })}
        onClick={toggleAll}
      />

      <form onSubmit={addTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={onChangeQuery}
          disabled={loading}
        />
      </form>
    </header>
  );
};
