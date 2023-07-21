import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  allCopmletedCheck: () => boolean;
  handleToggleAllTodosCompleted: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  todoTitle: string;
  tempTodo: Todo | null;
  setTodoTitle: (todoTitle: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  allCopmletedCheck,
  handleToggleAllTodosCompleted,
  handleSubmit,
  todoTitle,
  tempTodo,
  setTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (

        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allCopmletedCheck,
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
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
