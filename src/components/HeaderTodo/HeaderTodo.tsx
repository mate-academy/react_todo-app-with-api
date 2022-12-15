import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { AddNewTodoForm } from '../AddNewTodoForm';

interface Props {
  todos: Todo[],
  user: User | null,
  title: string,
  onSetTitle: (newTitle: string) => void,
  onTodoAdd: (todoData: Omit<Todo, 'id'>) => void;
  onSetIsError: (newStatus: boolean) => void;
  onSetErrorText: (newText: string) => void;
  onSetAllTodosToComplete: () => void,
  isAdding: boolean;
}

export const HeaderTodo: React.FC<Props> = React.memo(({
  user,
  title,
  onSetTitle,
  onTodoAdd,
  onSetErrorText,
  onSetIsError,
  isAdding,
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

      <AddNewTodoForm
        user={user}
        title={title}
        onSetTitle={onSetTitle}
        onTodoAdd={onTodoAdd}
        onSetIsError={onSetIsError}
        onSetErrorText={onSetErrorText}
        isAdding={isAdding}
      />
    </header>
  );
});
