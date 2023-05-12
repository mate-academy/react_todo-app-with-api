/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { NewTodo } from '../NewTodo';

interface Props {
  todos: Todo[];
  toggleStatus: boolean;
  onUpdateAllTodosComplete: () => Promise<void>
}

export const Header: React.FC<Props> = React.memo(({
  todos,
  toggleStatus,
  onUpdateAllTodosComplete,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: toggleStatus,
          })}
          onClick={onUpdateAllTodosComplete}
        />
      )}

      <NewTodo />
    </header>
  );
});
