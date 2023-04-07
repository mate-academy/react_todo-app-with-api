import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  title: string,
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  createNewTitle: (title: string) => void,
  completedTodos: Todo[],
  activeTodos: Todo[],
  updateTodos: (todoId: number[], data: boolean) => void,
  isDisableInput: boolean,
}

export const Header: React.FC<Props> = React.memo(
  ({
    title,
    handleSubmit,
    createNewTitle,
    completedTodos,
    activeTodos,
    updateTodos,
    isDisableInput,
  }) => {
    return (
      <header className="todoapp__header">
        <button
          aria-label="Toggle All Todos"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !activeTodos.length },
          )}
          onClick={() => {
            if (!activeTodos.length) {
              updateTodos(completedTodos.map(todo => todo.id), false);
            } else {
              updateTodos(activeTodos.map(todo => todo.id), true);
            }
          }}
        />

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            disabled={isDisableInput}
            value={title}
            onChange={({ target }) => createNewTitle(target.value)}
          />
        </form>
      </header>
    );
  },
);
