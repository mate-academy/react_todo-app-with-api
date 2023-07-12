import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  hasActiveTodo: boolean;
  areAllTodosCompleted: () => boolean;
  handleToggleAllTodosCompleted: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  todoTitle: string;
  tempTodo: Todo | null;
  setTodoTitle: (todoTitle: string) => void;
};

export const Header: React.FC<Props> = ({
  hasActiveTodo,
  areAllTodosCompleted,
  handleToggleAllTodosCompleted,
  handleSubmit,
  todoTitle,
  tempTodo,
  setTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      {hasActiveTodo && (

        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          onClick={handleToggleAllTodosCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
