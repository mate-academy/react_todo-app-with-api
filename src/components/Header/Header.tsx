/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  query: string,
  onChangeQuery: (event: React.FormEvent<HTMLInputElement>) => void,
  addTodo: (event: React.KeyboardEvent<HTMLFormElement>) => void,
  loading: boolean,
  toggleAll: (event: React.MouseEvent) => void,
  visibleTodos: Todo[],
};

export const Header: React.FC<Props> = ({
  query,
  onChangeQuery,
  addTodo,
  loading,
  toggleAll,
  visibleTodos,
}) => {
  return (
    <header className="todoapp__header">

      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: visibleTodos.every(todo => todo.completed),
        })}
        onClick={toggleAll}
        style={{ visibility: !visibleTodos.length ? 'hidden' : 'visible' }}
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
