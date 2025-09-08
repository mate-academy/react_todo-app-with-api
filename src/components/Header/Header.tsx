import React, { forwardRef } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  isAdding: boolean;
  handleToggleAll: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header = React.memo(
  forwardRef<HTMLInputElement, Props>(
    (
      { todos, title, setTitle, isAdding, handleToggleAll, handleAddTodo },
      ref,
    ) => {
      return (
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={ref}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>
      );
    },
  ),
);
