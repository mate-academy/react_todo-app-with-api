/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  searchValue: string;
  searchHandler: (value: string) => void;
  onAdd: (event:
  React.FormEvent<HTMLFormElement>) => void;
  toggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  searchValue,
  searchHandler,
  onAdd,
  toggleAll,
}) => {
  const isActiveClass = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all', {
              active: isActiveClass,
            },
          )}
          onClick={toggleAll}
        />
      )}
      <form onSubmit={onAdd}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={searchValue}
          onChange={(event) => {
            searchHandler(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
