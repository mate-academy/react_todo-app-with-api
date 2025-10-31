import cn from 'classnames';
import { Todo } from '../types/Todo';
import React, { RefObject } from 'react';

interface Props {
  todos: Todo[];
  inputRef: RefObject<HTMLInputElement>;
  title: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInputDisabled: boolean;
  handleToggling: () => void;
  isLoading: boolean;
}

export const Header: React.FC<Props> = ({
  todos,
  inputRef,
  title,
  handleKeyDown,
  handleTitleChange,
  isInputDisabled,
  handleToggling,
  isLoading,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          onClick={handleToggling}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          disabled={isInputDisabled}
          autoFocus
        />
      </form>
    </header>
  );
};
