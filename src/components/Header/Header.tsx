import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { forwardRef } from 'react';

type Props = {
  prepariedTodos: Todo[];
  todoTitle: string;
  tempTodo: Todo | null;
  handleUncompletedTodos: () => void;
  handleAddingNewTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  handleSettingTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header = React.memo(
  forwardRef<HTMLInputElement, Props>(
    (
      {
        prepariedTodos,
        todoTitle,
        tempTodo,
        handleUncompletedTodos,
        handleAddingNewTodo,
        handleSettingTitle,
      },
      ref,
    ) => {
      return (
        <header className="todoapp__header">
          {prepariedTodos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: prepariedTodos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleUncompletedTodos}
            />
          )}

          <form onSubmit={handleAddingNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleSettingTitle}
              ref={ref}
              disabled={tempTodo !== null}
            />
          </form>
        </header>
      );
    },
  ),
);
