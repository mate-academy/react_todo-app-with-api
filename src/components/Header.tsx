import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  handleSudmit: (event: React.FormEvent) => void;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  isAdding: boolean;
  newTodoFaild: React.RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
};

export const Header = ({
  todos,
  handleSudmit,
  newTodoTitle,
  setNewTodoTitle,
  isAdding,
  newTodoFaild,
  handleToggleAll,
}: Props) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSudmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={even => setNewTodoTitle(even?.target.value)}
          autoFocus
          disabled={isAdding}
          ref={newTodoFaild}
        />
      </form>
    </header>
  );
};
