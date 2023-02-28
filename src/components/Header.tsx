import React from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  allActive: boolean | undefined,
  title: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onAddTodo: (event: React.FormEvent<HTMLFormElement>) => void,
  onAdding: boolean,
  todos: Todo[]
};

export const Header: React.FC<Props> = ({
  allActive,
  title,
  onChange,
  onAddTodo,
  onAdding,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {!todos.length || (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { allActive },
          )}
          aria-label="mark all"
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onChange}
          disabled={onAdding}
        />
      </form>
    </header>
  );
};
