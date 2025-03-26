import classNames from 'classnames';
import React, { MutableRefObject } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  loading: boolean;
  activeCount: number;
  handleToggle: (todo: Todo | undefined) => void;
  handleCreateTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  setFocused: (isFocused: boolean) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  newTodoTitle: string;
  isDisabled: boolean;
  setNewTodoTitle: (newTodoTitle: string) => void;
};

export const NewTodo: React.FC<Props> = ({
  todos,
  loading,
  activeCount,
  handleToggle,
  handleCreateTodo,
  setFocused,
  inputRef,
  newTodoTitle,
  isDisabled,
  setNewTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && !loading && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeCount === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggle(undefined)}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={e => handleCreateTodo(e)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setNewTodoTitle(e.target.value)}
          value={newTodoTitle}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
