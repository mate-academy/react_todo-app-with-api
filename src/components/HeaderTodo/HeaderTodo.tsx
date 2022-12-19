import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { AddNewTodoForm } from '../AddNewTodoForm';

interface Props {
  todos: Todo[],
  onTodoAdd: (todoData: Omit<Todo, 'id'>) => void;
  onSetAllTodosToComplete: () => void,
}

export const HeaderTodo: React.FC<Props> = React.memo(({
  onTodoAdd,
  onSetAllTodosToComplete,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.every(todo => todo.completed) },
        )}
        onClick={onSetAllTodosToComplete}
      />

      <AddNewTodoForm onTodoAdd={onTodoAdd} />
    </header>
  );
});
