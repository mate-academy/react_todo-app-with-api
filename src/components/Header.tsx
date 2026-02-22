import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  onToggleAll: () => void;
  todos: Todo[];
  activeTodos: number;
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  newTodoField,
  tempTodo,
  onToggleAll,
  todos,
  activeTodos,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodos === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}
      <form onSubmit={onSubmit}>
        <input
          ref={newTodoField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
