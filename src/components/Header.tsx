import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  newTitle: string;
  setNewTitle: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAllTodos: () => void;
  areAllCompleted: boolean;
  todos: Todo[];
}

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  isInputDisabled,
  inputRef,
  toggleAllTodos,
  areAllCompleted,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          autoFocus
          ref={inputRef}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};

export default Header;
