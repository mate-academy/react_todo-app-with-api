import React from 'react';
import clsx from 'clsx';
import { Todo } from '../types/Todo';

interface Props {
  title: string;
  changeTitle: (str: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  inProcess: boolean;
  onSubmit: (event: React.FormEvent) => void;
  todos: Todo[];
  toggleAll: (e: boolean) => void;
}

export const Header: React.FC<Props> = ({
  title,
  changeTitle,
  inputRef,
  inProcess,
  onSubmit,
  todos,
  toggleAll,
}) => {
  const isAllTodosActive = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length !== 0 && (
        <button
          type="button"
          className={clsx('todoapp__toggle-all', isAllTodosActive && 'active')}
          data-cy="ToggleAllButton"
          onClick={() => toggleAll(isAllTodosActive)}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => changeTitle(e.target.value)}
          value={title}
          ref={inputRef}
          disabled={inProcess}
        />
      </form>
    </header>
  );
};
